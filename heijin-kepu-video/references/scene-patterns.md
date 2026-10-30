# 常用画面套路

先判断这一场的字幕在说什么类型的信息，再选画面。

| 字幕在说 | 画面 |
|---|---|
| 一个时间、地点、事件开场 | `Kicker` + 一个场景示意（楼、街道、天空、实验室），`bg: "night"` 常用 |
| 一个数量（「132 只」「26 处」） | 左 `BigNumber` + 右 `IconGrid` |
| 比例（「九成」「三分之一」） | `IconGrid` 100 格高亮 N 格，或一根条被切成两段 |
| 趋势、随某个量变化 | `LineChart`，转折段 `turnAt` 换金色 |
| 两三个量的对比 | `BarChart`，或左右分屏两个 `BigNumber` |
| 一项研究/论文的结论 | `SourceNote` + `NumberList` |
| 一个物体是怎么工作的 | 自画线框示意图 + `Leader` 标注各部分，按字幕逐个画出来 |
| 一个过程/流程 | 3–5 个节点横排，箭头逐段画出（见下） |
| 历史时间线 | 一条横线 + 年份刻度，点逐个亮起（见下） |
| 揭晓一个概念/名词 | `ParticleText` |
| 「很多人以为…」被推翻 | 先出现说法，`cue(k)` 时画红色删除线或红叉，变暗 |
| 放大看细节 | 外框画一个圆形放大镜，里面同一图形 `scale(3)`（见下） |
| 收尾 | 回到开头的画面（呼应），或居中 `TitleCard` |

## 片段

### 剪影（用简单几何拼，不追求写实）
```tsx
// 猫：身体椭圆 + 头圆 + 两只三角耳 + 尾巴曲线，统一填 cream
<g transform={`translate(${x},${y}) scale(${s})`} fill={COLORS.cream}>
  <ellipse cx={0} cy={40} rx={46} ry={62} />
  <circle cx={0} cy={-38} r={34} />
  <path d="M-30 -55 L-24 -88 L-6 -66 Z M30 -55 L24 -88 L6 -66 Z" />
  <path d="M40 80 Q90 60 80 0" fill="none" stroke={COLORS.cream} strokeWidth={10} strokeLinecap="round" />
</g>
```
飞机、房子、人、仪器同理：3–8 个基本形状。线框风格就 `fill="none" stroke={COLORS.cream}`，用 `DrawPath` 描出来。

### 楼房窗户（夜景）
```tsx
{Array.from({ length: 12 * 20 }, (_, i) => {
  const c = i % 12, r = Math.floor(i / 12);
  const lit = random(`w${i}`) > 0.8;         // import { random } from "remotion"
  return <rect key={i} x={660 + c * 50} y={60 + r * 48} width={28} height={30}
    fill={lit ? COLORS.gold : "#1a1d26"} opacity={lit ? 0.75 : 1} />;
})}
```
随机数一律用 Remotion 的 `random("种子")`，不要用 `Math.random()`（每帧会变，画面会闪）。

### 流程箭头
```tsx
const nodes = ["光", "镜子", "感光元件", "解码"];
{nodes.map((t, i) => {
  const x = 360 + i * 400;
  return (
    <Fade as="g" key={i} at={cue(0) + i * 20}>
      <rect x={x - 110} y={440} width={220} height={100} rx={6} fill={COLORS.panel} stroke={COLORS.cream} strokeWidth={2} />
      <text x={x} y={502} textAnchor="middle" fontSize={34} fill={COLORS.cream} style={{ fontFamily: SERIF }}>{t}</text>
      {i < nodes.length - 1 && <DrawPath d={`M${x + 120} 490 L${x + 280} 490 M${x + 266} 480 L${x + 280} 490 L${x + 266} 500`} at={cue(0) + i * 20 + 10} dur={14} stroke={COLORS.gold} />}
    </Fade>
  );
})}
```

### 时间线
```tsx
const ev = [{ y: 1948, t: "沙滩上的点和划" }, { y: 1974, t: "第一次扫码" }];
const X = (yr: number) => 260 + ((yr - 1940) / 50) * 1400;
<DrawPath d="M260 560 L1660 560" at={0} dur={40} stroke={COLORS.creamDim} width={2} />
{ev.map((e, i) => (
  <Fade as="g" key={i} at={cue(i)}>
    <circle cx={X(e.y)} cy={560} r={9} fill={COLORS.goldBright} />
    <text x={X(e.y)} y={520} textAnchor="middle" fontSize={44} fill={COLORS.goldBright} style={{ fontFamily: SERIF }}>{e.y}</text>
    <text x={X(e.y)} y={620} textAnchor="middle" fontSize={28} fill={COLORS.cream} style={{ fontFamily: SERIF }}>{e.t}</text>
  </Fade>
))}
```

### 推翻一个说法（红色删除线）
```tsx
<Fade at={cue(0)} style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 64, color: COLORS.cream }}>
  条码里写着价格
</Fade>
<Stage><DrawPath d="M640 470 L1280 470" at={cue(1)} dur={14} stroke={COLORS.redBright} width={6} /></Stage>
```

### 放大镜
```tsx
<defs><clipPath id="lens"><circle cx={1300} cy={480} r={220} /></clipPath></defs>
<g clipPath="url(#lens)"><g transform="translate(1300,480) scale(3) translate(-700,-480)">{/* 同一个图形 */}</g></g>
<circle cx={1300} cy={480} r={220} fill="none" stroke={COLORS.gold} strokeWidth={4} />
```
SVG 里的 `id`（clipPath、gradient）每个场景取不同名字，避免和别的场景冲突。

### 缓慢漂浮 / 呼吸
```tsx
const bob = Math.sin(frame / 25) * 4;            // 上下漂 4px
const pulse = 0.75 + 0.25 * Math.sin(frame / 8); // 闪烁/呼吸
```
