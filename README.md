# 📦 inject-imports

> Clean up your files by offloading imports to shared files. Use `@injectImports` to automatically inject them at build time.

---

## 🚀 What is this?

Tired of scrolling through dozens of import lines before getting to your actual component?

With `inject-imports`, you can simply write:

```ts
// @injectImports common
export function MyComponent() {
  return <Button>Hello World</Button>;
}
```

```ts
// src/imports/common.ts
import { Button } from "@/components/ui/button";
```

### 📦 Installation

```bash
npm install inject-imports

```

### ⚙️ Framework Support

// create a table with the following columns

| Framework | Supported | Plugins                  |
| --------- | --------- | ------------------------ |
| Vite      | ✅        | vitePluginInjectImports  |
| Next.js   | ✅        | nextPluginInjectImports  |
| Babel     | ✅        | babelPluginInjectImports |

### 🧪 Usage Example

1. Create a shared import file

```ts
// src/imports/common.ts
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

2. Use it anywhere in your project

```ts
// @injectImports common
export default function App() {
  return <Button className={cn('bg-red-500')}>Click!</Button>;
}
```

### 🔌 Per-Framework Setup

Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { vitePluginInjectImports } from "inject-imports";

export default defineConfig({
  plugins: [vitePluginInjectImports()],
});
```

Next.js

Add this to your next.config.js:

```js
process.env.__NEXT_PLUGIN__ = "true";
```

Then configure Babel in .babelrc or babel.config.js:

```js
const { nextPluginInjectImports } = require("inject-imports");

module.exports = {
  plugins: [nextPluginInjectImports(require("@babel/core"))],
};
```

Standalone Babel usage

```js
const babel = require("@babel/core");
const { babelPluginInjectImports } = require("inject-imports");

babel.transform(code, {
  plugins: [babelPluginInjectImports(babel)],
});
```

### ⚙️ Options

```ts
interface InjectImportsOptions {
  importsDir?: string; // Default: 'src/imports'
}
```

## 🧠 Why use this?

- ✨ Clean and focused components
- 📁 Centralized import management
- ⚡ Works with TypeScript, JSX, and ESM
- 🔧 Framework-agnostic design

## 🔍 Smart detection

Use the smart helper defineInjectImports():

```ts
import { defineInjectImports } from "inject-imports";

export default {
  plugins: [defineInjectImports()],
};
```

It will automatically detect if you're using Vite, Next.js, or plain Babel.

## 📂 Suggested structure

```
src/
├─ imports/
│  ├─ common.ts
│  └─ react.ts
├─ components/
│  └─ App.tsx
```

## 💡 Created by

Made with love by people who hate messy imports ❤️
Codename: inject-imports

# 📦 inject-imports

[![npm version](https://img.shields.io/npm/v/inject-imports.svg?style=flat-square)](https://www.npmjs.com/package/inject-imports)
[![npm downloads](https://img.shields.io/npm/dm/inject-imports.svg?style=flat-square)](https://www.npmjs.com/package/inject-imports)

> Clean up your files by offloading imports to shared files. Use `@injectImports` to automatically inject them at build time.
