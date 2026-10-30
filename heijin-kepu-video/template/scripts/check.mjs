// 自检：类型检查 + 每场截两张图到 out/check/，看画面有没有重叠、出界、空场
// 用法：npm run check          （成片截图）
//       npm run gallery        （组件样张截图）
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { renderStill } from "@remotion/renderer";
import { OUT, ROOT, prepare } from "./lib.mjs";

const gallery = process.argv.includes("--gallery");
const dir = path.join(OUT, "check");
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

console.log("类型检查…");
const tsc = spawnSync(process.execPath, [path.join(ROOT, "node_modules/typescript/bin/tsc"), "--noEmit", "-p", ROOT], { encoding: "utf8" });
if (tsc.status !== 0) {
  console.log(tsc.stdout || tsc.stderr);
  console.log("✗ 代码有错误，先按上面的提示改好再运行");
  process.exit(1);
}

const { serveUrl, composition, opts } = await prepare(gallery ? "Gallery" : "Main");
const shots = [];
if (gallery) {
  for (let i = 0; i * 90 < composition.durationInFrames; i++) shots.push({ frame: i * 90 + 85, name: `gallery-${i + 1}` });
} else {
  const { marks, warnings } = composition.props;
  for (const w of warnings) console.log(`⚠ ${w}`);
  marks.forEach((m, i) => {
    shots.push({ frame: m.mid, name: `scene${i + 1}-a` });
    shots.push({ frame: m.full, name: `scene${i + 1}-b` });
  });
  console.log(`成片时长：${(composition.durationInFrames / 30).toFixed(1)} 秒，共 ${marks.length} 场`);
}
for (const s of shots) {
  const output = path.join(dir, `${s.name}.jpg`);
  await renderStill({ serveUrl, composition, frame: s.frame, output, imageFormat: "jpeg", jpegQuality: 80, ...opts });
  console.log(`  ${path.relative(ROOT, output)}  （第 ${(s.frame / 30).toFixed(1)} 秒）`);
}
console.log(`✓ 截图完成，在 ${dir}`);
