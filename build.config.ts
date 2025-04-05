import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  outDir: "dist",
  declaration: true,
  clean: true,
  externals: [
    "sass",
    "sass-embedded",
    "less",
    "stylus",
    "lightningcss",
    "postcss",
    "vite",
    "vite/runtime",
    "rollup",
    "rollup/parseAst",
  ],
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
  //tsconfig: "./tsconfig.json",
});
