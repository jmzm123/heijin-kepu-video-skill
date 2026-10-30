import type React from "react";
import type { BgKind } from "./components/Background";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";

// ════════════════════════════════════════════════════════════════
//  这是整条视频的「剧本」：标题、每一场的字幕、每一场用哪个画面组件。
//  字幕标记：【金色强调】 〖红色强调〗   每句尽量 ≤ 24 个字。
//  每句默认停留时间按字数自动算；要单独指定就写 { text: "……", hold: 3.5 }（秒）。
// ════════════════════════════════════════════════════════════════

export type Line = string | { text: string; hold?: number };
export type SceneDef = {
  component: React.FC;
  lines: Line[];
  bg?: BgKind; // warm（默认）| night | grid | plain
  lead?: number; // 第一句字幕前留白（秒），默认 0.5
  tail?: number; // 最后一句字幕后留白（秒），默认 0.8
};

export const META = {
  title: "冰山一角到底有多大", // 成片文件名
  cover: {
    lines: ["“冰山一角”", "到底有多大？"], // 封面两行大字，每行 ≤ 9 个字
    accent: "多大", // 封面上加金色底的词（要在 lines 里出现，只标第一次出现）
    sub: "密度 · 浮力 · 九成", // 竖版封面副标题
    scene: 1, // 封面背景用第几场（从 0 数）
    at: 6, // 取这一场第几秒的画面
  },
  credits: true, // 片尾「脚本、动画、剪辑 均由豆包Agent制作」
  creditsText: undefined as [string, string, string, string] | undefined, // 改片尾文字：["脚本、动画、剪辑", "均由", "豆包Agent", "制作"]
};

export const SCENES: SceneDef[] = [
  {
    component: Scene1,
    bg: "night",
    lines: ["我们常说「冰山一角」。", "可水面上这一角，到底占整座冰山的【多少】？"],
  },
  {
    component: Scene2,
    bg: "night",
    lines: ["把整座冰山翻出来看，", "藏在水下的部分，〖大得多〗。"],
  },
  {
    component: Scene3,
    bg: "grid",
    lines: ["答案藏在密度里：冰每立方厘米约【0.917 克】，", "海水约【1.025 克】，只比冰重一点点。", "冰要排开和自己一样重的海水，才能浮起来。"],
  },
  {
    component: Scene4,
    lines: ["0.917 除以 1.025，", "约【九成】的冰，都沉在水面以下。"],
  },
  {
    component: Scene5,
    lines: ["所以「冰山一角」，", "真的只有【十分之一】左右。"],
    tail: 1.6,
  },
];
