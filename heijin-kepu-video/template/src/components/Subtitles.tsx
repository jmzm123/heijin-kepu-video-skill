import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, SERIF } from "../theme";
import { SCENES } from "../story";
import { lineText, timeline } from "../timeline";

/** 「普通【金色】普通〖红色〗」→ 分段 */
export const parseMarks = (s: string) => {
  const out: { text: string; color: string }[] = [];
  let color: string = COLORS.cream;
  let buf = "";
  const push = () => {
    if (buf) out.push({ text: buf, color });
    buf = "";
  };
  for (const ch of s) {
    if (ch === "【" || ch === "〖") {
      push();
      color = ch === "【" ? COLORS.goldBright : COLORS.redBright;
    } else if (ch === "】" || ch === "〗") {
      push();
      color = COLORS.cream;
    } else buf += ch;
  }
  push();
  return out;
};

// 字幕在 Root 里统一画，场景不用管；画面底部 y > 940 的区域留给字幕
export const Subtitles: React.FC<{ scene: number }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { cues, ends } = timeline().scenes[scene];
  const k = cues.findIndex((c, i) => frame >= c && frame < (i + 1 < cues.length ? cues[i + 1] : ends[i]));
  if (k < 0) return null;
  const isLast = k === cues.length - 1;
  const stop = isLast ? ends[k] : cues[k + 1];
  const opacity = interpolate(frame, [cues[k], cues[k] + 5, stop - 5, stop], [0, 1, 1, isLast ? 0 : 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", bottom: 58, left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 140px", opacity }}>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 46,
          fontWeight: 600,
          textAlign: "center",
          letterSpacing: 1.5,
          lineHeight: 1.35,
          textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.8)",
        }}
      >
        {parseMarks(lineText(SCENES[scene].lines[k])).map((s, i) => (
          <span key={i} style={{ color: s.color }}>
            {s.text}
          </span>
        ))}
      </div>
    </div>
  );
};
