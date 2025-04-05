import { InjectImportsOptions } from "./core";
import babelPluginInjectImports from "./babel";

export default function nextPluginInjectImports(
  babel: any,
  options: InjectImportsOptions = {},
) {
  return babelPluginInjectImports(babel, options);
}
