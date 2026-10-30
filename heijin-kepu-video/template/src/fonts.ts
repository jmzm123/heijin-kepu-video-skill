import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/600.css";
import "@fontsource/noto-serif-sc/700.css";
import { useLayoutEffect } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";

// 字体全部本地加载，不依赖谷歌字体（国内网络可用）。得意黑用 @font-face 注册，用到时才下载
if (typeof document !== "undefined" && !document.getElementById("smiley-sans")) {
  const style = document.createElement("style");
  style.id = "smiley-sans";
  style.textContent = `@font-face { font-family: "Smiley Sans"; src: url("${staticFile("fonts/SmileySans-Oblique.ttf")}") format("truetype"); font-display: block; }`;
  document.head.appendChild(style);
}

/** 字体按需加载：每一帧截图前，等这一帧用到的字形都下载完（最多等 8 秒，超时就用后备字体，不卡死渲染） */
export const useFontsReady = () => {
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    void document.body.offsetHeight; // 触发排版，让新字形开始加载
    if (document.fonts.status !== "loading") return;
    const h = delayRender("等待字体");
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(h);
      }
    };
    document.fonts.ready.then(finish);
    const t = setTimeout(finish, 8000);
    return () => clearTimeout(t);
  }, [frame]);
};
