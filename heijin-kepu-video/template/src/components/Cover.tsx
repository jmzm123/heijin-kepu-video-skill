import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS, SERIF, TITLE_FONT } from "../theme";
import { META, SCENES } from "../story";
import { FPS, SceneIndex } from "../timeline";
import { Background } from "./Background";

// 封面：横 1440×1080 / 竖 1080×1440。背景取 META.cover 指定那一场、那一秒的画面（不带字幕），上面压两行得意黑标题
const Line: React.FC<{ s: string; size: number; top: number }> = ({ s, size, top }) => {
  const acc = META.cover.accent;
  const a = acc ? s.indexOf(acc) : -1;
  const parts = a >= 0 ? [s.slice(0, a), acc!, s.slice(a + acc!.length)] : [s];
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, top, textAlign: "center", whiteSpace: "pre", lineHeight: 1,
        fontFamily: TITLE_FONT, fontSize: size, letterSpacing: size * 0.04, color: COLORS.cream, textShadow: "0 4px 18px rgba(0,0,0,0.7)",
      }}
    >
      {parts.map((x, i) =>
        i === 1 ? (
          <span key={i} style={{ position: "relative", color: "#17161a", textShadow: "none" }}>
            <span
              style={{
                position: "absolute", left: -size * 0.1, right: -size * 0.06, top: size * 0.04, bottom: -size * 0.06,
                borderRadius: size * 0.12, background: COLORS.goldBright, zIndex: -1,
              }}
            />
            {x}
          </span>
        ) : (
          <span key={i}>{x}</span>
        )
      )}
    </div>
  );
};

export const Cover: React.FC<{ v: boolean }> = ({ v }) => {
  const { scene, at, lines, sub } = META.cover;
  const Shot = SCENES[scene].component;
  const size = v ? 124 : 108;
  const top = v ? 140 : 70;
  const shot = v ? { left: -420, top: 470, scale: 1 } : { left: -240, top: 330, scale: 0.75 };
  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", left: shot.left, top: shot.top, width: 1920, height: 1080, transform: `scale(${shot.scale})`,
          transformOrigin: "50% 0", WebkitMaskImage: "linear-gradient(transparent 0px, #000 90px)",
        }}
      >
        <Background kind={SCENES[scene].bg} />
        <SceneIndex.Provider value={scene}>
          <Sequence from={-Math.round(at * FPS)} layout="none">
            <Shot />
          </Sequence>
        </SceneIndex.Provider>
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 0, height: v ? 640 : 380,
          background: "linear-gradient(rgba(11,11,13,0.96) 55%, rgba(11,11,13,0))",
        }}
      />
      <div style={{ isolation: "isolate" }}>
        <Line s={lines[0]} size={size} top={top} />
        {lines[1] && <Line s={lines[1]} size={size} top={top + size * 1.22} />}
      </div>
      {v && sub && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: top + size * 2.62, textAlign: "center", fontFamily: SERIF,
            fontSize: size * 0.34, letterSpacing: size * 0.34 * 0.25, color: COLORS.creamDim,
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};
