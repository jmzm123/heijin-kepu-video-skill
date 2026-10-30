import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { META, SCENES, type Line } from "./story";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// 没有配音：每句字幕停留多久按字数算（约 4.5 字/秒，最短 2.4 秒），可在 story.ts 里用 hold 单独指定
const CHARS_PER_SEC = 4.5;
const LEAD = 0.5; // 每场第一句字幕前留白（秒），先让画面立住
const GAP = 0.15; // 句间空隙（秒）
const TAIL = 0.8; // 每场最后一句字幕之后留白（秒）

export const lineText = (l: Line) => (typeof l === "string" ? l : l.text);
/** 去掉【】〖〗标记后的纯文字 */
export const plain = (s: string) => s.replace(/[【】〖〗]/g, "");
const lineSec = (l: Line) =>
  typeof l !== "string" && l.hold ? l.hold : Math.max(2.4, plain(lineText(l)).length / CHARS_PER_SEC + 0.6);

const F = (s: number) => Math.round(s * FPS);

// 场景组件会 import 本文件，而 story.ts 又 import 场景组件，所以时间表在第一次用到时才算（避免循环引用时 SCENES 还没定义）
const compute = () => {
  const scenes = SCENES.map((s) => {
    const cues: number[] = [];
    const ends: number[] = [];
    let t = s.lead ?? LEAD;
    s.lines.forEach((l, k) => {
      if (k > 0) t += GAP;
      cues.push(F(t));
      t += lineSec(l);
      ends.push(F(t));
    });
    return { cues, ends, frames: F(t + (s.tail ?? TAIL)) };
  });
  const starts = scenes.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + scenes[i - 1].frames], []);
  const body = scenes.reduce((a, s) => a + s.frames, 0);
  const credits = META.credits ? 80 : 0;
  return { scenes, starts, body, credits, total: body + credits };
};
let cache: ReturnType<typeof compute> | null = null;
export const timeline = () => (cache ??= compute());

export const SceneIndex = createContext(0);

/**
 * 场景里用：
 *   const { frame, cue, end, dur } = useScene();
 *   cue(1)  第 2 句字幕出现的帧（场景内）；动画跟着字幕走就写 cue(k) + 偏移
 *   end(1)  第 2 句字幕结束的帧
 *   dur     本场总帧数
 */
export const useScene = () => {
  const i = useContext(SceneIndex);
  const frame = useCurrentFrame();
  const t = timeline().scenes[i];
  const at = (arr: number[], k: number) => arr[Math.max(0, Math.min(arr.length - 1, k))];
  return {
    frame,
    cue: (k: number) => at(t.cues, k),
    end: (k: number) => at(t.ends, k),
    dur: t.frames,
  };
};
