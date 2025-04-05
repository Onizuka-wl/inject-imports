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

        // 👇 Este paso es importante: asegurate de pasar options.referenceComment si querés el auto-reference.
        const transformed = transformInjectImports(code, filename, {
          ...options,
          referenceComment: options.referenceComment ?? true, // activar por defecto si no se pasa
        });

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
