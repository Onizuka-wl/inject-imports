import fs from "fs";
import path from "path";

export interface InjectImportsOptions {
  importsDir?: string;
}

export function transformInjectImports(
  code: string,
  _filePath: string,
  options: InjectImportsOptions = {},
): string {
  const importsDir =
    options.importsDir || path.resolve(process.cwd(), "src/imports");
  const importRegex = /\/\/\s*@injectImports\s+([a-zA-Z0-9_\-]+)/g;
  const matches = Array.from(code.matchAll(importRegex));

  if (matches.length === 0) return code;

  const injected = new Set<string>();
  let importsToInject = "";

  for (const match of matches) {
    const importName = match[1];
    if (injected.has(importName)) continue;

    const importFilePath = path.resolve(importsDir, `${importName}.ts`);
    if (!fs.existsSync(importFilePath)) {
      throw new Error(`[inject-imports] File not found: ${importFilePath}`);
    }

    const fileContent = fs.readFileSync(importFilePath, "utf-8");
    importsToInject += `${fileContent}\n`;
    injected.add(importName);
  }

  return `${importsToInject}\n${code.replace(importRegex, "")}`;
}
