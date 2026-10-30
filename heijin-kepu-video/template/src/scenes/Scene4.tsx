import React from "react";
import { AbsoluteFill } from "remotion";
import { BigNumber, IconGrid } from "../components/kit";
import { Stage } from "../components/ui";
import { useScene } from "../timeline";

// 第 4 场：100 格里 90 格亮起，配大数字
export const Scene4: React.FC = () => {
  const { cue } = useScene();
  return (
    <AbsoluteFill>
      <BigNumber at={cue(0)} value={89.5} decimals={1} suffix="%" label="沉在水面以下" sub="0.917 ÷ 1.025 ≈ 0.895" x={560} y={430} />
      <Stage>
        <IconGrid at={cue(0)} count={100} cols={10} x={1080} y={200} cell={56} size={40} highlight={90} highlightAt={cue(1)} stagger={0.5} />
      </Stage>
    </AbsoluteFill>
  );
};
