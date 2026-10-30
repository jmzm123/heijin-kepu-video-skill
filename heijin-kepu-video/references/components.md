# 组件手册

所有组件在 `src/components/kit.tsx`（画面组件）和 `src/components/ui.tsx`（基础工具）。
**时间参数都是场景内帧数**（30 帧 = 1 秒），写成 `cue(k) + 偏移`。

## 场景模板

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { BigNumber, Kicker, SourceNote, IconGrid } from "../components/kit";
import { DrawPath, Fade, Leader, Stage, Tag, prog, mix } from "../components/ui";
import { COLORS, SERIF } from "../theme";
import { useScene } from "../timeline";

// 第 2 场：一句话说明这一场画什么
export const Scene2: React.FC = () => {
  const { frame, cue, end, dur } = useScene();
  // cue(0) 第 1 句字幕出现的帧；cue(1) 第 2 句……；end(k) 第 k+1 句结束；dur 本场总帧数
  const p = prog(frame, cue(1), 20); // 第 2 句出现时开始、20 帧内 0→1
  return (
    <AbsoluteFill>
      {/* HTML 组件直接放这里 */}
      <Kicker at={0} big="1984" small="纽约 · 动物医学中心" />
      <Stage>
        {/* SVG 图形放在 Stage 里（1920×1080 坐标） */}
        <circle cx={960} cy={500} r={mix(0, 120, p)} fill="none" stroke={COLORS.gold} strokeWidth={3} />
      </Stage>
    </AbsoluteFill>
  );
};
```

然后在 `src/story.ts` 里 `import { Scene2 } from "./scenes/Scene2";`，放进 `SCENES`。
**背景、字幕、换场、音乐由框架处理，场景里不要画。**

## 基础工具（ui.tsx）

| 名称 | 用法 |
|---|---|
| `prog(frame, start, dur=18)` | 返回 0→1 的缓动进度，用来驱动任何属性 |
| `mix(a, b, p)` | 按进度在 a、b 之间取值 |
| `ease` | 默认缓动曲线 |
| `<Stage>` | 全屏 SVG 画布，SVG 元素放里面 |
| `<Fade at dur outAt rise as="div"/"g">` | 淡入（可淡出、可上移）。在 SVG 里用 `as="g"` |
| `<DrawPath d at dur stroke width fill fillAt dash>` | SVG 路径描线动画，画完可填色 |
| `<Tag x y text color size anchor>` | SVG 里的带框小标签：「示意」「原论文图 2」「海平面」 |
| `<Leader x1 y1 x2 y2 label at color anchor size>` | SVG 引线标注：从物体上的点拉线到文字 |

## 画面组件（kit.tsx）

### Kicker — 左上角大字 + 小字
```tsx
<Kicker at={0} big="1943" small="欧洲上空 · 盟军轰炸机编队" />
<Kicker at={cue(1)} big="26 处弹孔" color={COLORS.redBright} />
```

### SourceNote — 右上角文献出处 + 红印章
```tsx
<SourceNote at={0} en="High-Rise Syndrome in Cats" zh="猫的高楼综合征" by="Whitney & Mehlhaff · JAVMA · 1987" seal="示意" />
```
`seal={false}` 去掉印章。`Seal` 也可以单独用：`<Seal text="原理" />`。

### BigNumber — 会滚动的大数字
```tsx
<BigNumber at={cue(0)} value={132} label="只 · 坠楼送医的猫" sub="1984.6 — 1984.11" x={520} y={480} />
<BigNumber at={cue(1)} value={89.5} decimals={1} suffix="%" label="沉在水面以下" />
```
`x, y` 是数字中心点。`color` 默认亮金，`size` 默认 150。

### IconGrid — N 个图标的矩阵，前 M 个高亮（SVG，放 Stage 里）
```tsx
<IconGrid at={cue(0)} count={132} cols={12} x={1040} y={240} cell={46} size={30}
  highlight={13} highlightAt={cue(2)} shape="dot" />
```
`shape`: `"square"`（默认）| `"dot"` | `"person"`。自定义图标用 `renderIcon={(cx, cy, s, color) => <path .../>}`。
高亮后其他图标变暗（`dimTo`）。`stagger` 控制逐个出现的间隔帧。总尺寸 = cols × cell 宽、行数 × cell 高，摆放前算一下别出界。

### LineChart — 折线图，可在转折点换色（SVG）
```tsx
<LineChart at={cue(0)} x={560} y={230} w={900} h={520}
  data={[{ label: "2", value: 0.3 }, { label: "3", value: 0.55 }, { label: "7-8", value: 1.2 }, { label: "≥9", value: 0.05 }]}
  max={1.4} ticks={[0.5, 1]} yTitle="骨折数（每只猫）" xTitle="坠落楼层" turnAt={3} dur={60} />
```

### BarChart — 柱状图（SVG）
```tsx
<BarChart at={cue(0)} x={560} y={240} w={800} h={520} max={1.2} ticks={[0.5, 1]} yTitle="密度（克 / 立方厘米）"
  data={[{ label: "冰", value: 0.917, text: "0.917" }, { label: "海水", value: 1.025, text: "1.025", color: COLORS.gold }]}
  stagger={45} />
```
柱子之间用 `stagger` 拉开，让第二根柱子跟第二句字幕一起出现（`stagger ≈ cue(1) - cue(0)`）。

### NumberList — 编号要点 I、II、III
```tsx
<NumberList at={[cue(1), cue(2)]} title="论文的解释" items={["约 5 层后，不再加速", "放松四肢，分散冲击"]} x={1000} y={300} />
```
`at` 数组和 `items` 一样长。新的一条出现时旧的变暗（`dimOld`）。

### TitleCard — 居中大标题
```tsx
<TitleCard at={cue(0)} title="第二个问题" sub="为什么不加速了？" y={420} />
```
`font="title"` 用得意黑。

### ParticleText — 金色粒子聚成大字（点题、揭晓概念）
```tsx
<ParticleText at={cue(0)} text="幸存者偏差" y={420} size={150} />
```
文字 2–6 个字最好看；一整片最多用 1–2 次。

## 自己画东西

组件没有的（动物、飞机、建筑、地图、仪器）用 SVG 自己画，见 `scene-patterns.md`。
