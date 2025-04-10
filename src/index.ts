import { default as vitePluginInjectImports } from "./vite";
import { default as babelPluginInjectImports } from "./babel";
import { default as nextPluginInjectImports } from "./next";
import { transformInjectImports } from "./core";
import type { InjectImportsOptions } from "./core";
import type { InjectImportsVitePluginOptions } from "./vite";

export {
  vitePluginInjectImports,
  babelPluginInjectImports,
  nextPluginInjectImports,
  transformInjectImports,
  InjectImportsOptions,
  InjectImportsVitePluginOptions,
};

export function defineInjectImports(options?: InjectImportsOptions): unknown {
  // Next.js (Babel)
  if (process.env.__NEXT_PLUGIN__ === "true") {
    return nextPluginInjectImports(require("@babel/core"), options);
  }

  // Vite.js (by installed dependency)
  if (typeof require !== "undefined" && require.resolve) {
    try {
      require.resolve("vite");
      return vitePluginInjectImports(options);
    } catch {
      //no-op
    }
  }

  // Fallback: Babel generic plugin
  if (typeof require !== "undefined" && require.resolve) {
    try {
      require.resolve("@babel/core");
      return babelPluginInjectImports(require("@babel/core"), options);
    } catch {
      //no-op
    }
  }

  throw new Error(
    "[inject-imports] No supported bundler detected. Use vitePluginInjectImports() or babelPluginInjectImports() explicitly.",
  );
}
