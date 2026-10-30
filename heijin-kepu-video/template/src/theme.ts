// 黑金配色：近黑底 + 奶油白主色 + 金色强调 + 砖红警示。全片只用这几种颜色。
export const COLORS = {
  bg: "#0b0b0d",
  bgGlow: "#1a1712",
  cream: "#ece2cf", // 主文字、主线条
  creamDim: "#b9ad97", // 次要文字、坐标轴
  muted: "#6f685c", // 最弱的辅助信息
  gold: "#d4af6a", // 强调
  goldBright: "#e8c98a", // 最强强调、数字
  red: "#c2685a", // 反面、错误、警示
  redBright: "#e0705f",
  panel: "#141416", // 卡片、标签底色
  grid: "rgba(236,226,207,0.05)",
};

// 正文用宋体系衬线字（思源宋体 / Noto Serif SC，离线打包在 node_modules 里）
export const SERIF = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "SimSun", serif';
// 封面、片尾、大标题用得意黑
export const TITLE_FONT = '"Smiley Sans", "Noto Serif SC", serif';
