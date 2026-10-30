import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { useFontsReady } from "./fonts";
import { Background } from "./components/Background";
import { BarChart, BigNumber, IconGrid, Kicker, LineChart, NumberList, ParticleText, SourceNote, TitleCard } from "./components/kit";
import { Leader, Stage, Tag } from "./components/ui";
import { COLORS } from "./theme";

// 组件样张（不进成片）：npm run check 会把每一页截成图放到 out/check/gallery-*.jpg，写场景前先看一眼
const PAGES: React.FC[] = [
  () => (
    <AbsoluteFill>
      <Kicker at={0} big="1984" small="纽约 · 动物医学中心" />
      <SourceNote at={0} en="High-Rise Syndrome in Cats" zh="猫的高楼综合征" by="Whitney & Mehlhaff · JAVMA · 1987" seal="示意" />
      <BigNumber at={0} value={132} label="只 · 坠楼送医的猫" sub="Kicker / SourceNote / BigNumber" x={560} y={520} />
      <Stage>
        <IconGrid at={0} count={132} cols={12} x={1040} y={260} cell={46} size={30} highlight={17} highlightAt={30} shape="dot" />
      </Stage>
    </AbsoluteFill>
  ),
  () => (
    <AbsoluteFill>
      <Stage>
        <LineChart
          at={0}
          dur={40}
          data={[
            { label: "2", value: 0.3 }, { label: "3", value: 0.55 }, { label: "4", value: 0.75 }, { label: "5", value: 0.95 },
            { label: "6", value: 1.05 }, { label: "7-8", value: 1.2 }, { label: "≥9", value: 0.05 },
          ]}
          max={1.4}
          ticks={[0.5, 1]}
          turnAt={5}
          yTitle="骨折数（每只猫）"
          xTitle="坠落楼层"
        />
        <Tag x={1300} y={200} text="示意 · 原论文图 2" />
      </Stage>
    </AbsoluteFill>
  ),
  () => (
    <AbsoluteFill>
      <Stage>
        <BarChart at={0} data={[{ label: "A", value: 40 }, { label: "B", value: 75, color: COLORS.gold }, { label: "C", value: 20, color: COLORS.red }]} ticks={[25, 50, 75]} yTitle="BarChart" x={200} w={700} />
        <Leader x1={1200} y1={700} x2={1400} y2={600} label="Leader 引线" at={0} color={COLORS.goldBright} />
      </Stage>
      <NumberList at={[0, 10, 20]} title="NumberList" items={["约 5 层后，不再加速", "放松四肢，分散冲击", "第三条示例"]} x={1060} y={220} />
    </AbsoluteFill>
  ),
  () => (
    <AbsoluteFill>
      <TitleCard at={0} title="TitleCard 标题" sub="副标题 · 小字" y={260} />
      <ParticleText at={0} text="幸存者偏差" y={700} size={120} dur={30} />
    </AbsoluteFill>
  ),
];
const PAGE = 90;
export const GALLERY_FRAMES = PAGES.length * PAGE;

export const Gallery: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill>
      {PAGES.map((P, i) => (
        <Sequence key={i} from={i * PAGE} durationInFrames={PAGE} layout="none">
          <Background kind={i === 1 ? "grid" : "warm"} />
          <P />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
