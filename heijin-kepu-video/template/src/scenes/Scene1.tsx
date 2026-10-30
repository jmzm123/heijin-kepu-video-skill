import React from "react";
import { AbsoluteFill } from "remotion";
import { Kicker } from "../components/kit";
import { DrawPath, Fade, Stage, prog } from "../components/ui";
import { COLORS } from "../theme";
import { useScene } from "../timeline";
import { ICE_TOP, WATER_Y } from "./iceberg";

// 第 1 场：夜色海面，只看得见水面上的冰山尖
export const Scene1: React.FC = () => {
  const { frame, cue } = useScene();
  const water = prog(frame, 0, 30);
  const bob = Math.sin(frame / 22) * 3;
  return (
    <AbsoluteFill>
      <Kicker at={6} big="北大西洋" small="海面 · 一座普通的冰山" />
      <Stage>
        <g transform={`translate(0,${bob})`}>
          <DrawPath d={ICE_TOP} at={12} dur={40} stroke={COLORS.cream} width={3} fill="#2a2e36" fillAt={40} />
        </g>
        <rect x={0} y={WATER_Y} width={1920} height={610} fill="#0d1624" opacity={0.85 * water} />
        <line x1={960 - 960 * water} y1={WATER_Y} x2={960 + 960 * water} y2={WATER_Y} stroke={COLORS.creamDim} strokeWidth={2} />
        <Fade as="g" at={cue(1)}>
          <text x={1150} y={360} fill={COLORS.goldBright} fontSize={64} style={{ fontFamily: "Noto Serif SC, serif" }}>
            ?
          </text>
        </Fade>
      </Stage>
    </AbsoluteFill>
  );
};
