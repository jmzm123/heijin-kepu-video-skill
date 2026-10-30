import React from "react";
import { AbsoluteFill } from "remotion";
import { BarChart, SourceNote } from "../components/kit";
import { Fade, Stage } from "../components/ui";
import { COLORS, SERIF } from "../theme";
import { useScene } from "../timeline";

// 第 3 场：冰和海水的密度对比（柱状图）
export const Scene3: React.FC = () => {
  const { cue } = useScene();
  return (
    <AbsoluteFill>
      <SourceNote at={0} en="Archimedes' principle" zh="浮力定律" by="阿基米德 · 约公元前 250 年" seal="原理" />
      <Stage>
        <BarChart
          at={cue(0)}
          x={560}
          y={240}
          w={800}
          h={520}
          max={1.2}
          ticks={[0.5, 1]}
          yTitle="密度（克 / 立方厘米）"
          data={[
            { label: "冰", value: 0.917, text: "0.917", color: COLORS.cream },
            { label: "海水", value: 1.025, text: "1.025", color: COLORS.gold },
          ]}
          stagger={45}
        />
      </Stage>
      <Fade at={cue(2)} rise={12} style={{ position: "absolute", left: 1420, top: 420, fontFamily: SERIF, color: COLORS.creamDim, fontSize: 30, lineHeight: 1.7 }}>
        只差约 <span style={{ color: COLORS.goldBright, fontSize: 44 }}>0.1</span> 克
      </Fade>
    </AbsoluteFill>
  );
};
