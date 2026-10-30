// 渲染成片：画面 + 背景音乐 → 响度标准化 → out/<标题>.mp4，再出横竖两张封面
// 用法：npm run render
import fs from "node:fs";
import path from "node:path";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { OUT, ffmpeg, prepare, safeName } from "./lib.mjs";

fs.mkdirSync(OUT, { recursive: true });
const { serveUrl, composition, opts } = await prepare("Main");
const name = safeName(composition.props.title);
const raw = path.join(OUT, "raw.mp4");
const final = path.join(OUT, `${name}.mp4`);

console.log(`渲染画面（${(composition.durationInFrames / 30).toFixed(1)} 秒）…`);
let last = -1;
await renderMedia({
  serveUrl, composition, codec: "h264", crf: 18, concurrency: Number(process.env.CONCURRENCY) || null, audioCodec: "aac", audioBitrate: "320k", outputLocation: raw, ...opts,
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 20) * 5;
    if (p !== last) { last = p; console.log(`  ${p}%`); }
  },
});

// 纯音乐视频：两遍 loudnorm 线性标准化到 -16 LUFS、真峰值 -1.5 dB（Remotion 自带的 ffmpeg 就够，不用另装）
console.log("响度标准化…");
const LN = "loudnorm=I=-16:TP=-1.5:LRA=11";
const probe = ffmpeg(["-hide_banner", "-i", raw, "-vn", "-af", `${LN}:print_format=json`, "-f", "null", "-"]);
const json = /\{[^{}]*"input_i"[^{}]*\}/.exec((probe.stderr || "") + (probe.stdout || ""));
let ok = false;
if (json) {
  const j = JSON.parse(json[0]);
  const af = `${LN}:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
  const r = ffmpeg(["-v", "error", "-y", "-i", raw, "-map", "0:v", "-map", "0:a", "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "256k", "-ar", "48000", final]);
  ok = r.status === 0;
  if (ok) console.log(`  原始响度 ${j.input_i} LUFS → -16 LUFS`);
}
if (ok) fs.rmSync(raw);
else {
  fs.renameSync(raw, final);
  console.log("  跳过（没有背景音乐，或 ffmpeg 出错），直接用原始音量");
}

console.log("渲染封面…");
for (const [id, file] of [["Cover-H", "封面_横_4比3.png"], ["Cover-V", "封面_竖_3比4.png"]]) {
  const c = await selectComposition({ serveUrl, id, ...opts });
  await renderStill({ serveUrl, composition: c, output: path.join(OUT, file), imageFormat: "png", ...opts });
}
console.log(`\n✓ 完成\n  视频：${final}\n  封面：${path.join(OUT, "封面_横_4比3.png")}\n        ${path.join(OUT, "封面_竖_3比4.png")}`);
