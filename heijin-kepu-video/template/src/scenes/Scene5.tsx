import React from "react";
import { AbsoluteFill } from "remotion";
import { ParticleText } from "../components/kit";
import { Fade } from "../components/ui";
import { COLORS, SERIF } from "../theme";
import { useScene } from "../timeline";

// 第 5 场：粒子聚成点题文字
export const Scene5: React.FC = () => {
  const { cue } = useScene();
  return (
    <AbsoluteFill>
      <ParticleText at={0} text="冰山一角" y={420} size={150} />
      <Fade at={cue(1)} style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontSize: 40, color: COLORS.creamDim, letterSpacing: 8 }}>
        ≈ 1 / 10
      </Fade>
    </AbsoluteFill>
  );
};
