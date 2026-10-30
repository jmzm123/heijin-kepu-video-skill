import React from "react";
import { AbsoluteFill } from "remotion";
import { Kicker } from "../components/kit";
import { DrawPath, Leader, Stage, Tag, prog } from "../components/ui";
import { COLORS } from "../theme";
import { useScene } from "../timeline";
import { ICE_BOTTOM, ICE_TOP, WATER_Y } from "./iceberg";

// 第 2 场：水下部分一笔一笔画出来，标出水上 / 水下
export const Scene2: React.FC = () => {
  const { frame, cue } = useScene();
  const glow = prog(frame, cue(1), 20);
  return (
    <AbsoluteFill>
      <Kicker at={0} big="水面以下" small="剖面 · 示意" />
      <Stage>
        <rect x={0} y={WATER_Y} width={1920} height={610} fill="#0d1624" opacity={0.85} />
        <DrawPath d={ICE_BOTTOM} at={cue(0) + 6} dur={50} stroke={COLORS.goldBright} width={3} fill="#3a3324" fillAt={cue(1)} />
        <path d={ICE_TOP} fill="#2a2e36" stroke={COLORS.cream} strokeWidth={3} strokeLinejoin="round" />
        <line x1={0} y1={WATER_Y} x2={1920} y2={WATER_Y} stroke={COLORS.creamDim} strokeWidth={2} />
        <circle cx={960} cy={700} r={260 * glow} fill={COLORS.goldBright} opacity={0.06 * glow} />
        <Leader x1={1060} y1={400} x2={1360} y2={330} label="水面以上" at={cue(0) + 10} color={COLORS.cream} />
        <Leader x1={1180} y1={720} x2={1440} y2={720} label="水面以下" at={cue(1)} color={COLORS.goldBright} />
        <Tag x={300} y={WATER_Y - 54} text="海平面" color={COLORS.creamDim} />
      </Stage>
    </AbsoluteFill>
  );
};
