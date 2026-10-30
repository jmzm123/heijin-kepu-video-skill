// check.mjs / render.mjs 共用：找浏览器、打包工程、调用 Remotion 自带的 ffmpeg
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition } from "@remotion/renderer";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OUT = path.join(ROOT, "out");

/**
 * 选浏览器（国内网络下载不了 Remotion 自带的 Chrome，所以优先用电脑上已有的 Chrome / Edge）：
 * 1. 环境变量 BROWSER_PATH 2. Remotion 已下载好的 headless shell 3. 系统里的 Chrome / Edge / Chromium 4. 让 Remotion 自己下载
 */
export const pickBrowser = () => {
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return { browserExecutable: process.env.BROWSER_PATH, chromeMode: "chrome-for-testing", name: process.env.BROWSER_PATH };
  }
  if (fs.existsSync(path.join(ROOT, "node_modules/.remotion/chrome-headless-shell"))) {
    return { browserExecutable: null, chromeMode: "headless-shell", name: "Remotion 自带 Chrome" };
  }
  const env = process.env;
  const list = {
    win32: [
      `${env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
      `${env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
      `${env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      `${env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      `${env.HOME}/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
    ],
    linux: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge"],
  }[process.platform] ?? [];
  const found = list.find((p) => p && !p.startsWith("undefined") && fs.existsSync(p));
  if (found) return { browserExecutable: found, chromeMode: "chrome-for-testing", name: found };
  return { browserExecutable: null, chromeMode: "headless-shell", name: "Remotion 自带 Chrome（需要下载，国内网络可能失败）" };
};

/** 打包工程并取出合成（Main 的 props 里带着时间表） */
export const prepare = async (id = "Main") => {
  const browser = pickBrowser();
  console.log(`浏览器：${browser.name}`);
  console.log("打包工程…");
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts"), publicDir: path.join(ROOT, "public") });
  const opts = { browserExecutable: browser.browserExecutable, chromeMode: browser.chromeMode };
  const composition = await selectComposition({ serveUrl, id, ...opts });
  return { serveUrl, composition, opts };
};

/** 调 Remotion 自带的 ffmpeg（不需要另外安装 ffmpeg） */
export const ffmpeg = (args) => {
  const cli = path.join(ROOT, "node_modules/@remotion/cli/remotion-cli.js");
  return spawnSync(process.execPath, [cli, "ffmpeg", ...args], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
};

export const safeName = (s) => s.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 60) || "video";
