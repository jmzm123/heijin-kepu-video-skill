# 常见问题

| 现象 | 处理 |
|---|---|
| `node` 不是内部或外部命令 / command not found | 没装 Node.js。Windows：`winget install OpenJS.NodeJS.LTS`；macOS：`brew install node` 或从 https://npmmirror.com/mirrors/node/ 下载 LTS 安装包。装完**重新打开终端**。 |
| `npm install` 很慢或超时 | 确认工作目录里有 `.npmrc`（内容 `registry=https://registry.npmmirror.com`）。仍失败就重试一次；公司网络可能要设代理。 |
| `npm install` 报 esbuild / 权限错误 | 删掉 `node_modules` 和 `package-lock.json` 重装。Windows 上不要放在需要管理员权限的目录（如 `C:\Program Files`）。 |
| 「浏览器：Remotion 自带 Chrome（需要下载…）」后卡住或报网络错误 | 电脑上没找到 Chrome/Edge。让用户安装 Chrome 或 Edge；或设置环境变量 `BROWSER_PATH` 为浏览器程序完整路径再运行（Windows：`set BROWSER_PATH=C:\...\msedge.exe`，macOS/Linux：`export BROWSER_PATH=...`）。 |
| 类型检查报错 | 按报错的文件和行号改。常见：组件少传了必填参数（`at`）、import 路径写错、场景没在 `story.ts` 里 import。 |
| `delayRender ... was not cleared after 28000ms` | 某一帧算得太久。检查场景里有没有特别大的数组（上万个元素）、死循环、`fetch` 网络请求（不要用）。 |
| 画面里中文变成方块或宋体不对 | `npm install` 没装完整，重新装；不要在场景里改用别的字体名。 |
| 字幕和画面对不上 | 场景里写死了帧数。改成 `cue(k) + 偏移`。 |
| 画面闪烁 / 每次渲染不一样 | 用了 `Math.random()` 或 `Date.now()`，改成 Remotion 的 `random("种子")`。 |
| 渲染完没有声音 | 正常：本技能默认出无声成片，背景音乐由用户后期配。想自动带音乐，把它改名 `music.mp3` 放进 `public/` 重新渲染。 |
| 渲染太慢或电脑卡死 | 正常 1 分钟视频需 1–5 分钟。设置环境变量 `CONCURRENCY` 调整同时渲染的帧数：低配电脑设 2，高配设 8（默认按 CPU 核数自动选）。 |
| 想在浏览器里实时预览 | `npm run studio`，打开它给的本地网址，左侧选 `Main`。 |
