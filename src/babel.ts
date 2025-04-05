import { transformInjectImports, InjectImportsOptions } from "./core";

export default function injectImportsBabelPlugin(
  babel: any,
  options: InjectImportsOptions = {},
) {
  return {
    name: "babel-plugin-inject-imports",
    visitor: {
      Program(path: any, state: any) {
        const filename = state.file.opts.filename;
        const code = state.file.code;
        const transformed = transformInjectImports(code, filename, options);

        if (transformed !== code) {
          const newAst = babel.parse(transformed, {
            filename,
            sourceType: "module",
            plugins: ["typescript", "jsx"],
          });

          if (newAst) {
            path.replaceWith(newAst.program);
          }
        }
      },
    },
  };
}
