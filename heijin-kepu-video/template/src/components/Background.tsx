import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type BgKind = "warm" | "night" | "grid" | "plain";

const rand = (seed: number) => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const DUST = Array.from({ length: 46 }, (_, i) => {
  const r = (k: number) => rand(i * 7 + k * 131 + 3);
  return { x: r(1) * 1920, y: r(2) * 1080, r: 1.2 + r(3) * 3.2, vx: -3 + r(4) * 6, vy: -2 + r(5) * 4, o: 0.08 + r(6) * 0.22, ph: r(7) * 6.28 };
});

// warm：默认，中心一团暖金色微光；night：偏蓝的夜色（城市、天空、历史场景）；grid：浅网格（图表、计算）；plain：纯暗底
const GLOW: Record<BgKind, string> = { warm: COLORS.bgGlow, grid: COLORS.bgGlow, night: "#141b2a", plain: "#111113" };

export const Background: React.FC<{ kind?: BgKind }> = ({ kind = "warm" }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: kind === "night" ? "#080a10" : COLORS.bg }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`glow-${kind}`} cx="50%" cy="46%" r="70%">
            <stop offset="0%" stopColor={GLOW[kind]} stopOpacity={0.9} />
            <stop offset="55%" stopColor="#101013" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#050506" stopOpacity={1} />
          </radialGradient>
          <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
            <stop offset="60%" stopColor="#000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
          </radialGradient>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.05" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width={1920} height={1080} fill={`url(#glow-${kind})`} />
        {kind === "grid" && (
          <g stroke={COLORS.grid} strokeWidth={1}>
            {Array.from({ length: 39 }, (_, i) => <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={1080} />)}
            {Array.from({ length: 22 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 50} x2={1920} y2={i * 50} />)}
          </g>
        )}
        <rect width={1920} height={1080} fill="url(#vignette)" />
        {DUST.map((d, i) => (
          <circle
            key={i}
            cx={(((d.x + d.vx * t) % 1920) + 1920) % 1920}
            cy={(((d.y + d.vy * t) % 1080) + 1080) % 1080}
            r={d.r}
            fill={COLORS.cream}
            opacity={d.o * (0.6 + 0.4 * Math.sin(t * 0.6 + d.ph))}
          />
        ))}
        <rect width={1920} height={1080} filter="url(#grain)" opacity={0.6} />
      </svg>
    </AbsoluteFill>
  );
};
