import React from "react";
import { random, useCurrentFrame } from "remotion";
import { COLORS, SERIF, TITLE_FONT } from "../theme";
import { ease, mix, prog } from "./ui";

// 黑金科普常用画面组件。时间参数 at 都是场景内帧数（写成 cue(k) + 偏移）。
// HTML 组件（Kicker、SourceNote、BigNumber、NumberList、TitleCard、ParticleText）直接放在场景的 <AbsoluteFill> 里；
// SVG 组件（IconGrid、LineChart、BarChart）放在 <Stage> 里。

/* ───────────── 左上角：年份/时间 + 地点 ───────────── */
export const Kicker: React.FC<{
  at: number;
  big: string; // 「1984」「7 层」「26 处弹孔」
  small?: string; // 「纽约 · 动物医学中心」
  color?: string;
}> = ({ at, big, small, color = COLORS.cream }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 16);
  const line = prog(frame, at + 6, 20);
  return (
    <div style={{ position: "absolute", left: 96, top: 60, fontFamily: SERIF, opacity: p }}>
      <div style={{ fontSize: 76, color, letterSpacing: 2, lineHeight: 1.1, transform: `translateY(${(1 - p) * 12}px)` }}>{big}</div>
      {small && (
        <div style={{ fontSize: 26, color: COLORS.creamDim, letterSpacing: 3, marginTop: 10 }}>{small}</div>
      )}
      <div style={{ marginTop: 16, height: 1.5, width: 260 * line, background: COLORS.creamDim, opacity: 0.6 }} />
    </div>
  );
};

/* ───────────── 红色印章（「示意」「图解」） ───────────── */
export const Seal: React.FC<{ text?: string; size?: number; style?: React.CSSProperties }> = ({ text = "示意", size = 44, style }) => (
  <div
    style={{
      width: size,
      height: size * 1.2,
      background: "#a8392c",
      borderRadius: 4,
      color: "#f3e3d3",
      fontFamily: SERIF,
      fontWeight: 700,
      fontSize: size * 0.36,
      lineHeight: 1.1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      writingMode: "vertical-rl",
      letterSpacing: 2,
      boxShadow: "inset 0 0 0 2px rgba(243,227,211,0.35)",
      ...style,
    }}
  >
    {text}
  </div>
);

/* ───────────── 右上角：出处（英文斜体 + 《中文名》 + 作者年份 + 印章） ───────────── */
export const SourceNote: React.FC<{
  at: number;
  en?: string; // 原文标题 High-Rise Syndrome in Cats
  zh: string; // 中文名，不用写书名号
  by?: string; // Whitney & Mehlhaff · JAVMA · 1987
  seal?: string | false;
}> = ({ at, en, zh, by, seal = "出处" }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 18);
  return (
    <div style={{ position: "absolute", right: 96, top: 56, display: "flex", gap: 18, opacity: p, fontFamily: SERIF }}>
      <div style={{ textAlign: "right" }}>
        {en && <div style={{ fontSize: 20, fontStyle: "italic", color: COLORS.creamDim, letterSpacing: 0.5 }}>{en}</div>}
        <div style={{ fontSize: 26, color: COLORS.gold, marginTop: 6, letterSpacing: 2 }}>《{zh}》</div>
        {by && <div style={{ fontSize: 17, color: COLORS.muted, marginTop: 8, letterSpacing: 1 }}>{by}</div>}
        <div style={{ height: 1, background: COLORS.creamDim, opacity: 0.35, marginTop: 12 }} />
      </div>
      {seal && <Seal text={seal} size={40} />}
    </div>
  );
};

/* ───────────── 大数字（会从 0 数上去） ───────────── */
export const BigNumber: React.FC<{
  at: number;
  value: number;
  x?: number; // 数字中心点
  y?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string; // 「%」「万」，比数字小一号
  label?: string; // 数字下面的说明
  sub?: string; // 更小一行，如「1984.6 — 1984.11」
  size?: number;
  color?: string;
  dur?: number; // 数字滚动时长（帧）
}> = ({ at, value, x = 960, y = 470, decimals = 0, prefix = "", suffix = "", label, sub, size = 150, color = COLORS.goldBright, dur = 36 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 12);
  const n = value * prog(frame, at, dur, ease);
  return (
    <div style={{ position: "absolute", left: x - 600, width: 1200, top: y - size * 0.7, textAlign: "center", fontFamily: SERIF, opacity: p }}>
      <div style={{ fontSize: size, color, fontWeight: 600, lineHeight: 1, letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {n.toLocaleString("zh-CN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix && <span style={{ fontSize: size * 0.45, marginLeft: 8 }}>{suffix}</span>}
      </div>
      {label && <div style={{ fontSize: 30, color: COLORS.cream, marginTop: size * 0.2, letterSpacing: 3 }}>{label}</div>}
      {sub && <div style={{ fontSize: 20, color: COLORS.muted, marginTop: 10, letterSpacing: 2 }}>{sub}</div>}
    </div>
  );
};

/* ───────────── 图标/点阵矩阵（N 个里有 M 个高亮） ───────────── */
export const IconGrid: React.FC<{
  at: number;
  count: number;
  cols: number;
  x: number; // 左上角
  y: number;
  cell?: number; // 每格间距
  size?: number; // 每个图标大小
  highlight?: number; // 前 M 个高亮（默认 0）
  highlightAt?: number; // 高亮开始的帧（默认跟出现一起）
  color?: string;
  hiColor?: string;
  dimTo?: number; // 高亮后，没被高亮的变暗到多少透明度
  stagger?: number; // 每个图标出现间隔（帧）
  shape?: "dot" | "square" | "person";
  renderIcon?: (cx: number, cy: number, size: number, color: string) => React.ReactNode; // 自定义图标
}> = ({
  at, count, cols, x, y, cell = 44, size = 30, highlight = 0, highlightAt, color = COLORS.creamDim, hiColor = COLORS.goldBright,
  dimTo = 0.35, stagger = 0.6, shape = "square", renderIcon,
}) => {
  const frame = useCurrentFrame();
  const hiP = highlight > 0 ? prog(frame, highlightAt ?? at, 20) : 0;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const cx = x + (i % cols) * cell + cell / 2;
        const cy = y + Math.floor(i / cols) * cell + cell / 2;
        const appear = prog(frame, at + i * stagger, 10);
        if (appear <= 0) return null;
        const hi = i < highlight;
        const c = hi && hiP > 0.5 ? hiColor : color;
        const o = appear * (hi ? 1 : mix(1, dimTo, hiP));
        let icon: React.ReactNode;
        if (renderIcon) icon = renderIcon(cx, cy, size, c);
        else if (shape === "dot") icon = <circle cx={cx} cy={cy} r={size / 2} fill={c} />;
        else if (shape === "person")
          icon = (
            <g fill={c}>
              <circle cx={cx} cy={cy - size * 0.28} r={size * 0.18} />
              <path d={`M${cx - size * 0.3} ${cy + size * 0.48} Q${cx - size * 0.3} ${cy - size * 0.05} ${cx} ${cy - size * 0.05} Q${cx + size * 0.3} ${cy - size * 0.05} ${cx + size * 0.3} ${cy + size * 0.48} Z`} />
            </g>
          );
        else icon = <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={3} fill={c} />;
        return (
          <g key={i} opacity={o}>
            {icon}
          </g>
        );
      })}
    </g>
  );
};

/* ───────────── 坐标轴（LineChart / BarChart 共用） ───────────── */
const Axes: React.FC<{
  x: number; y: number; w: number; h: number; p: number; max: number; ticks: number[];
  xTitle?: string; yTitle?: string; tickFmt: (v: number) => string;
}> = ({ x, y, w, h, p, max, ticks, xTitle, yTitle, tickFmt }) => (
  <g opacity={p} style={{ fontFamily: SERIF }}>
    <line x1={x} y1={y + h} x2={x + w * p} y2={y + h} stroke={COLORS.creamDim} strokeWidth={1.5} />
    <line x1={x} y1={y + h} x2={x} y2={y + h - h * p} stroke={COLORS.creamDim} strokeWidth={1.5} />
    {ticks.map((t) => (
      <g key={t}>
        <line x1={x} y1={y + h - (t / max) * h} x2={x + w} y2={y + h - (t / max) * h} stroke={COLORS.creamDim} strokeOpacity={0.12} />
        <text x={x - 14} y={y + h - (t / max) * h + 7} textAnchor="end" fontSize={20} fill={COLORS.creamDim}>
          {tickFmt(t)}
        </text>
      </g>
    ))}
    {yTitle && (
      <text x={x} y={y - 24} fontSize={22} fill={COLORS.creamDim}>
        {yTitle}
      </text>
    )}
    {xTitle && (
      <text x={x + w} y={y + h + 78} textAnchor="end" fontSize={22} fill={COLORS.creamDim}>
        {xTitle}
      </text>
    )}
  </g>
);

/* ───────────── 折线图（线条一点点画出来，可在某个点之后换颜色表示「转折」） ───────────── */
export const LineChart: React.FC<{
  at: number;
  data: { label: string; value: number }[];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  max?: number;
  ticks?: number[];
  tickFmt?: (v: number) => string;
  xTitle?: string;
  yTitle?: string;
  dur?: number; // 画线时长（帧）
  turnAt?: number; // 从第几个点开始换色（转折段）
  color?: string;
  turnColor?: string;
}> = ({
  at, data, x = 560, y = 230, w = 900, h = 520, max, ticks, tickFmt = (v) => String(v), xTitle, yTitle, dur = 60,
  turnAt, color = COLORS.cream, turnColor = COLORS.goldBright,
}) => {
  const frame = useCurrentFrame();
  const m = max ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const tk = ticks ?? [m / 2, m];
  const axP = prog(frame, at, 20);
  const pts = data.map((d, i) => ({ px: x + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w), py: y + h - (d.value / m) * h, ...d }));
  const lineP = prog(frame, at + 18, dur, ease) * (pts.length - 1);
  const seg = (a: number, b: number, c: string, key: string) => {
    const vis = pts.slice(a, b + 1);
    const parts: string[] = [];
    vis.forEach((pt, j) => {
      const i = a + j;
      if (i > lineP + 1) return;
      if (i <= lineP) parts.push(`${parts.length ? "L" : "M"}${pt.px} ${pt.py}`);
      else {
        const prev = pts[i - 1];
        const f = lineP - (i - 1);
        parts.push(`L${mix(prev.px, pt.px, f)} ${mix(prev.py, pt.py, f)}`);
      }
    });
    return parts.length > 1 ? <path key={key} d={parts.join(" ")} fill="none" stroke={c} strokeWidth={3} strokeLinejoin="round" /> : null;
  };
  const t = turnAt ?? pts.length;
  return (
    <g>
      <Axes x={x} y={y} w={w} h={h} p={axP} max={m} ticks={tk} xTitle={xTitle} yTitle={yTitle} tickFmt={tickFmt} />
      {pts.map((pt, i) => (
        <text key={i} x={pt.px} y={y + h + 38} textAnchor="middle" fontSize={22} fill={COLORS.creamDim} opacity={axP} style={{ fontFamily: SERIF }}>
          {pt.label}
        </text>
      ))}
      {seg(0, Math.min(t, pts.length - 1), color, "a")}
      {t < pts.length && seg(t, pts.length - 1, turnColor, "b")}
      {pts.map((pt, i) =>
        lineP >= i - 0.01 ? <circle key={i} cx={pt.px} cy={pt.py} r={i >= t ? 8 : 6} fill={i >= t ? turnColor : color} /> : null
      )}
    </g>
  );
};

/* ───────────── 柱状图（柱子长出来，顶部显示数值） ───────────── */
export const BarChart: React.FC<{
  at: number;
  data: { label: string; value: number; color?: string; text?: string }[];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  max?: number;
  ticks?: number[];
  tickFmt?: (v: number) => string;
  yTitle?: string;
  stagger?: number; // 每根柱子间隔（帧）
}> = ({ at, data, x = 560, y = 230, w = 800, h = 520, max, ticks, tickFmt = (v) => String(v), yTitle, stagger = 8 }) => {
  const frame = useCurrentFrame();
  const m = max ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const axP = prog(frame, at, 20);
  const slot = w / data.length;
  const bw = Math.min(140, slot * 0.5);
  return (
    <g style={{ fontFamily: SERIF }}>
      <Axes x={x} y={y} w={w} h={h} p={axP} max={m} ticks={ticks ?? []} yTitle={yTitle} tickFmt={tickFmt} />
      {data.map((d, i) => {
        const p = prog(frame, at + 14 + i * stagger, 26);
        const bh = (d.value / m) * h * p;
        const cx = x + slot * (i + 0.5);
        const c = d.color ?? COLORS.cream;
        return (
          <g key={i}>
            <rect x={cx - bw / 2} y={y + h - bh} width={bw} height={bh} fill={c} opacity={0.9} />
            <text x={cx} y={y + h - bh - 18} textAnchor="middle" fontSize={34} fill={c} opacity={prog(frame, at + 30 + i * stagger, 10)}>
              {d.text ?? d.value}
            </text>
            <text x={cx} y={y + h + 40} textAnchor="middle" fontSize={26} fill={COLORS.creamDim} opacity={axP}>
              {d.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/* ───────────── 编号要点（I、II、III），一条条出现 ───────────── */
export const NumberList: React.FC<{
  at: number[]; // 每一条出现的帧，长度 = items.length（常写成 [cue(1), cue(2)]）
  items: string[];
  title?: string;
  x?: number;
  y?: number;
  size?: number;
  dimOld?: boolean; // 新的一条出现时，旧的变暗
}> = ({ at, items, title, x = 1000, y = 300, size = 36, dimOld = true }) => {
  const frame = useCurrentFrame();
  const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
  const last = at.reduce((k, t, i) => (frame >= t ? i : k), -1);
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: SERIF, color: COLORS.cream }}>
      {title && (
        <div style={{ fontSize: size * 0.85, color: COLORS.gold, letterSpacing: 4, opacity: prog(frame, at[0] - 10, 14) }}>
          {title}
          <div style={{ height: 1, width: 520, background: COLORS.creamDim, opacity: 0.35, marginTop: 16, marginBottom: 28 }} />
        </div>
      )}
      {items.map((s, i) => {
        const p = prog(frame, at[i], 14);
        const dim = dimOld && i < last ? 0.45 : 1;
        return (
          <div key={i} style={{ display: "flex", gap: 30, alignItems: "baseline", marginBottom: size * 0.9, opacity: p * dim, transform: `translateX(${(1 - p) * -16}px)` }}>
            <span style={{ width: 40, fontSize: size * 0.7, color: COLORS.creamDim, textAlign: "right" }}>{ROMAN[i]}</span>
            <span style={{ fontSize: size, letterSpacing: 2 }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ───────────── 居中大标题（章节卡、结论） ───────────── */
export const TitleCard: React.FC<{
  at: number;
  title: string;
  sub?: string;
  size?: number;
  color?: string;
  y?: number;
  font?: "serif" | "title";
}> = ({ at, title, sub, size = 110, color = COLORS.goldBright, y = 400, font = "serif" }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 24);
  const sp = prog(frame, at + 16, 18);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - size / 2, textAlign: "center" }}>
      <div
        style={{
          fontFamily: font === "title" ? TITLE_FONT : SERIF,
          fontWeight: font === "title" ? 400 : 600,
          fontSize: size,
          color,
          letterSpacing: mix(size * 0.4, size * 0.12, p),
          opacity: p,
          filter: `blur(${(1 - p) * 10}px)`,
          textShadow: "0 0 40px rgba(232,201,138,0.25)",
        }}
      >
        {title}
      </div>
      {sub && (
        <div style={{ fontFamily: SERIF, fontSize: 32, color: COLORS.creamDim, marginTop: 30, letterSpacing: 6, opacity: sp }}>{sub}</div>
      )}
    </div>
  );
};

/* ───────────── 金色粒子聚成文字（点题、揭晓概念时用） ───────────── */
export const ParticleText: React.FC<{
  at: number;
  text: string;
  y?: number;
  size?: number;
  dur?: number; // 聚合时长（帧）
  count?: number;
}> = ({ at, text, y = 420, size = 140, dur = 50, count = 420 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur, ease);
  const textP = prog(frame, at + dur * 0.55, dur * 0.6);
  const w = text.length * size * 1.05;
  const glow = prog(frame, at + dur, 30);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: count }, (_, i) => {
          const sx = random(`sx${i}`) * 2400 - 240;
          const sy = random(`sy${i}`) * 1300 - 110;
          const tx = 960 - w / 2 + random(`tx${i}`) * w;
          const ty = y - size * 0.45 + random(`ty${i}`) * size * 0.9;
          const delay = random(`d${i}`) * 0.35;
          const q = Math.max(0, Math.min(1, (p - delay) / (1 - delay)));
          const drift = Math.sin(frame * 0.05 + i) * 6 * (1 - textP);
          const o = (0.25 + random(`o${i}`) * 0.75) * (q > 0 ? 1 : 0.3) * (1 - textP * 0.85);
          return (
            <circle
              key={i}
              cx={mix(sx, tx, q) + drift}
              cy={mix(sy, ty, q)}
              r={0.8 + random(`r${i}`) * 2.2}
              fill={random(`c${i}`) > 0.3 ? COLORS.goldBright : COLORS.cream}
              opacity={o}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - size * 0.62,
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: size * 0.08,
          color: COLORS.goldBright,
          opacity: textP,
          filter: `blur(${(1 - textP) * 14}px)`,
          textShadow: `0 0 ${20 + glow * 30}px rgba(232,201,138,${0.25 + glow * 0.2})`,
        }}
      >
        {text}
      </div>
    </>
  );
};
