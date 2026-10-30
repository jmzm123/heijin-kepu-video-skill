import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, SERIF } from "../theme";

// 所有时间参数都是「场景内帧数」（30 帧 = 1 秒），通常写成 cue(k) + 偏移

export const ease = Easing.bezier(0.45, 0, 0.2, 1);

/** 从 start 开始、持续 dur 帧的 0→1 进度（带缓动，前后夹紧） */
export const prog = (frame: number, start: number, dur = 18, easing = ease) =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** 两个数之间按进度取值 */
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** 淡入（可选淡出）。as="g" 时用在 <svg> 里 */
export const Fade: React.FC<{
  at?: number;
  dur?: number;
  outAt?: number; // 从这一帧开始淡出
  outDur?: number;
  rise?: number; // 淡入时从下方上移多少像素
  as?: "div" | "g";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at = 0, dur = 14, outAt, outDur = 12, rise = 0, as = "div", style, children }) => {
  const frame = useCurrentFrame();
  const pin = prog(frame, at, dur);
  const pout = outAt === undefined ? 0 : prog(frame, outAt, outDur);
  const opacity = pin * (1 - pout);
  const dy = (1 - pin) * rise;
  if (as === "g") {
    return (
      <g opacity={opacity} transform={dy ? `translate(0,${dy})` : undefined} style={style}>
        {children}
      </g>
    );
  }
  return <div style={{ opacity, transform: dy ? `translateY(${dy}px)` : undefined, ...style }}>{children}</div>;
};

/** SVG 路径按笔画「画出来」 */
export const DrawPath: React.FC<{
  d: string;
  at: number;
  dur?: number;
  stroke?: string;
  width?: number;
  fill?: string;
  fillAt?: number; // 画完后填色（帧）
  opacity?: number;
  dash?: string; // 虚线，如 "8 10"（虚线不做描线动画，直接淡入）
}> = ({ d, at, dur = 30, stroke = COLORS.cream, width = 3, fill = "none", fillAt, opacity = 1, dash }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  const fp = fillAt === undefined ? 0 : prog(frame, fillAt, 15);
  if (p <= 0) return null;
  return (
    <path
      d={d}
      fill={fill}
      fillOpacity={fill === "none" ? undefined : fp}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={dash ? undefined : 1}
      strokeDasharray={dash ?? `${p} 1`}
      opacity={opacity * (dash ? p : 1)}
    />
  );
};

/** 带边框的小标签（SVG 内用），如「示意」「原论文图 2」 */
export const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  anchor?: "start" | "middle";
}> = ({ x, y, text, color = COLORS.creamDim, size = 22, anchor = "middle" }) => {
  const w = text.length * size * 0.92 + 28;
  const left = anchor === "middle" ? x - w / 2 : x;
  return (
    <g>
      <rect x={left} y={y} width={w} height={size + 18} rx={3} fill={COLORS.panel} stroke={color} strokeWidth={1.5} />
      <text x={left + w / 2} y={y + size + 4} textAnchor="middle" fill={color} fontSize={size} style={{ fontFamily: SERIF }}>
        {text}
      </text>
    </g>
  );
};

/** 引线标注：从点 (x1,y1) 拉一条线到 (x2,y2)，末端写字（SVG 内用） */
export const Leader: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  at: number;
  color?: string;
  anchor?: "start" | "end";
  size?: number;
}> = ({ x1, y1, x2, y2, label, at, color = COLORS.cream, anchor = "start", size = 30 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 18);
  const tp = prog(frame, at + 14, 10);
  if (p <= 0) return null;
  return (
    <g>
      <circle cx={x1} cy={y1} r={5} fill={color} />
      <line x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke={color} strokeWidth={2} />
      <text
        x={anchor === "start" ? x2 + 14 : x2 - 14}
        y={y2 + size * 0.35}
        textAnchor={anchor}
        fill={color}
        fontSize={size}
        opacity={tp}
        style={{ fontFamily: SERIF }}
      >
        {label}
      </text>
    </g>
  );
};

/** 全屏 SVG 画布（1920×1080），场景里的图形都画在这里面 */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);
