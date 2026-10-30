import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, Still, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./fonts";
import { useFontsReady } from "./fonts";
import { Background } from "./components/Background";
import { Subtitles } from "./components/Subtitles";
import { Credits } from "./components/Credits";
import { Cover } from "./components/Cover";
import { Gallery, GALLERY_FRAMES } from "./Gallery";
import { META, SCENES } from "./story";
import { FPS, H, SceneIndex, W, lineText, plain, timeline } from "./timeline";

// 只有背景音乐，没有配音。音量在渲染脚本里再统一做响度标准化。
// 音乐文件放在 public/music.mp3（仓库不附带，需自行放入）；没有这个文件就渲染无声视频
const BGM_VOLUME = 0.9;
const hasMusic = () => getStaticFiles().some((f) => f.name === "music.mp3");

/** 换场时短暂压暗 */
const Dip: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5, 10], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity }} />;
};

const Main: React.FC<Record<string, unknown>> = () => {
  useFontsReady();
  const { scenes, starts, body, credits, total } = timeline();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map((s, i) => {
        const Scene = s.component;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={scenes[i].frames} layout="none">
            <SceneIndex.Provider value={i}>
              <Background kind={s.bg} />
              <Scene />
              <Subtitles scene={i} />
            </SceneIndex.Provider>
          </Sequence>
        );
      })}
      {credits > 0 && (
        <Sequence from={body} durationInFrames={credits} layout="none">
          <Credits />
        </Sequence>
      )}
      {[...starts.slice(1), ...(credits > 0 ? [body] : [])].map((s, i) => (
        <Sequence key={`dip${i}`} from={s - 5} durationInFrames={10} layout="none">
          <Dip />
        </Sequence>
      ))}
      {hasMusic() && <Audio
        src={staticFile("music.mp3")}
        loop
        volume={(f) =>
          BGM_VOLUME *
          interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
          interpolate(f, [total - 60, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />}
    </AbsoluteFill>
  );
};

const CoverStill: React.FC<{ v: boolean }> = ({ v }) => {
  useFontsReady();
  return <Cover v={v} />;
};

/** 给 scripts/check.mjs 用：每场截图的帧位 + 剧本里的问题 */
const checkInfo = () => {
  const { scenes, starts, total } = timeline();
  const marks = scenes.map((s, i) => ({
    mid: starts[i] + Math.round(s.frames * 0.45),
    full: starts[i] + Math.max(0, s.ends[s.ends.length - 1] - 6),
  }));
  const warnings: string[] = [];
  SCENES.forEach((s, i) =>
    s.lines.forEach((l, k) => {
      const n = plain(lineText(l)).length;
      if (n > 30) warnings.push(`第 ${i + 1} 场第 ${k + 1} 句字幕 ${n} 个字，太长会换行，建议拆成两句`);
    })
  );
  if (total / FPS > 180) warnings.push(`成片 ${(total / FPS).toFixed(0)} 秒，超过 3 分钟，建议精简`);
  if (META.cover.accent && !META.cover.lines.some((l) => l.includes(META.cover.accent!)))
    warnings.push("META.cover.accent 不在封面文字里，封面不会有金色强调");
  if (META.cover.scene >= SCENES.length) warnings.push("META.cover.scene 超出场景数量");
  if (!hasMusic()) warnings.push("没有找到 public/music.mp3，成片将没有背景音乐");
  return { title: META.title, marks, warnings };
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={timeline().total} fps={FPS} width={W} height={H} defaultProps={checkInfo()} />
    <Still id="Cover-H" component={CoverStill} defaultProps={{ v: false }} width={1440} height={1080} />
    <Still id="Cover-V" component={CoverStill} defaultProps={{ v: true }} width={1080} height={1440} />
    <Composition id="Gallery" component={Gallery} durationInFrames={GALLERY_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
