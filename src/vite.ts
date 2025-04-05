import { Plugin } from "vite";
import { transformInjectImports, InjectImportsOptions } from "./core";

export default function injectImports(
  options: InjectImportsOptions = {},
): Plugin {
  const extensions = [".ts", ".js", ".tsx", ".jsx"];

  return {
    name: "vite-plugin-inject-imports",
    enforce: "pre",

    transform(code: string, id: string) {
      if (!extensions.some((ext) => id.endsWith(ext))) return;
      const newCode = transformInjectImports(code, id, options);
      return newCode === code ? undefined : { code: newCode, map: null };
    },
  };
}
