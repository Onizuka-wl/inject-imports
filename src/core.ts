import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export interface InjectImportsOptions {
  importsDir?: string;
  referenceComment?: boolean; // opcional para inyectar referencia automática
  generateTypes?: boolean; // generar .d.ts por bloque
}

export function generateAllTypesBlocks(
  importsDir = path.resolve(process.cwd(), "src/imports"),
  outBaseDir = ".inject-imports",
) {
  fs.mkdirSync(outBaseDir, { recursive: true });

  const files = fs.readdirSync(importsDir);

  for (const file of files) {
    const fullPath = path.join(importsDir, file);

    if (!fs.statSync(fullPath).isFile()) continue;
    if (!file.endsWith(".ts")) continue;

    const blockName = path.basename(file, ".ts");
    generateTypesForBlock(fullPath, blockName, outBaseDir);
  }

  console.log(`[inject-imports] Generated types for ${files.length} blocks.`);
}

export function generateTypesForBlock(
  importFilePath: string,
  blockName: string,
  baseOutDir = ".inject-imports",
) {
  const blockDir = path.resolve(process.cwd(), baseOutDir, blockName);
  fs.mkdirSync(blockDir, { recursive: true });

  const code = fs.readFileSync(importFilePath, "utf-8");
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  let dts = "";

  traverse(ast, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      const source = path.node.source.value;
      const specifiers = path.node.specifiers;

      if (specifiers.length === 0) {
        // side-effect import
        dts += `import "${source}";\n`;
        return;
      }

      for (const specifier of specifiers) {
        if (specifier.type === "ImportSpecifier") {
          const imported = specifier.imported.name;
          const local = specifier.local.name;
          dts += `declare const ${local}: typeof import("${source}")["${imported}"];\n`;
        } else if (specifier.type === "ImportDefaultSpecifier") {
          const local = specifier.local.name;
          dts += `declare const ${local}: typeof import("${source}")["default"];\n`;
        } else if (specifier.type === "ImportNamespaceSpecifier") {
          const local = specifier.local.name;
          dts += `declare const ${local}: typeof import("${source}");\n`;
        }
      }
    },
  });

  const dtsPath = path.join(blockDir, "index.d.ts");
  const pkgPath = path.join(blockDir, "package.json");

  fs.mkdirSync(blockDir, { recursive: true });
  fs.writeFileSync(dtsPath, dts);
  fs.writeFileSync(
    pkgPath,
    JSON.stringify(
      {
        name: blockName,
        types: "index.d.ts",
      },
      null,
      2,
    ),
  );
}

export function transformInjectImports(
  code: string,
  _filePath: string,
  options: InjectImportsOptions = {},
): string {
  const importsDir =
    options.importsDir || path.resolve(process.cwd(), "src/imports");

  const importRegex = /\/\/\s*@injectImports\(["']([\w\-]+)["']\)/g;

  const matches = Array.from(code.matchAll(importRegex));
  if (matches.length === 0) return code;

  const injected = new Set<string>();
  let importsToInject = "";
  let referenceDirectives = "";

  for (const match of matches) {
    const importName = match[1];
    if (injected.has(importName)) continue;

    const importFilePath = path.resolve(importsDir, `${importName}.ts`);
    if (!fs.existsSync(importFilePath)) {
      throw new Error(`[inject-imports] File not found: ${importFilePath}`);
    }

    const fileContent = fs.readFileSync(importFilePath, "utf-8");
    importsToInject += `${fileContent}\n`;

    // 🔧 Automatic TS reference generation
    if (options.referenceComment) {
      referenceDirectives += `/// <reference types="${importName}" />\n`;
    }

    // 🧠 Generate TS types .d.ts
    if (options.generateTypes) {
      generateTypesForBlock(importFilePath, importName);
    }

    injected.add(importName);
  }

  const cleanedCode = code.replace(importRegex, "").trimStart();

  return `${referenceDirectives}${importsToInject}\n${cleanedCode}`;
}
