import { transformInjectImports, InjectImportsOptions } from "./core";

export interface InjectImportsVitePluginOptions {
  name: string;
  enforce?: "pre" | "post";
  apply?: "serve" | "build" | ((config: any, env: any) => boolean);
  config?: (...args: any[]) => any;
  transform?: (...args: any[]) => any;
}

export default function injectImportsVitePlugin(
  options: InjectImportsOptions = {},
): InjectImportsVitePluginOptions {
  const extensions = [".ts", ".js", ".tsx", ".jsx"];

  return {
    name: "vite-plugin-inject-imports",
    enforce: "pre",

    transform(code: string, id: string) {
      if (!extensions.some((ext) => id.endsWith(ext))) return;

      const transformedCode = transformInjectImports(code, id, options);

      if (transformedCode !== code) {
        console.debug(`[inject-imports] Injected imports into: ${id}`);
      }

      return transformedCode === code
        ? undefined
        : { code: transformedCode, map: null };
    },
  };
}
