import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { COLORS, TITLE_FONT } from "../theme";
import { META } from "../story";

// 片尾署名（story.ts 里 META.credits 设为 false 可去掉）
export const Credits: React.FC = () => {
  const frame = useCurrentFrame();
  const o = (t: number) => interpolate(frame, [t, t + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = (t: number) => ({ opacity: o(t), transform: `translateY(${(1 - o(t)) * 16}px)` });
  const [l1, l2, l3, l4] = META.creditsText ?? ["脚本、动画、剪辑", "均由", "豆包Agent", "制作"];
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, fontFamily: TITLE_FONT, color: COLORS.cream, letterSpacing: 6 }}>
        <div style={{ fontSize: 76, ...rise(0) }}>{l1}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28, fontSize: 76, ...rise(8) }}>
          <span>{l2}</span>
          <span style={{ fontSize: 132, color: COLORS.goldBright }}>{l3}</span>
          <span>{l4}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
