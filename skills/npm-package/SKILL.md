---
name: npm-package
description: Scaffold a production-grade npm package with TypeScript, dual ESM/CJS output, testing, linting, CI/CD, and publishing configuration. Use when the user wants to create a new npm package, library, or module from scratch.
disable-model-invocation: true
argument-hint: [package-name]
---

# Production-Grade npm Package Creator

Create a fully configured, publish-ready npm package named `$ARGUMENTS`.

If no package name was provided, ask the user for one before proceeding.

## Phase 1: Discovery

Before scaffolding, ask the user these questions (present as a numbered list, accept answers in one shot):

1. **Package description** — One-line summary of what this package does.
2. **Scope** — Should it be scoped (e.g., `@org/package`)? If so, what org?
3. **Runtime target** — Node.js only, browser only, or universal?
4. **Entry point style** — Single entry point or multiple subpath exports (e.g., `pkg/utils`, `pkg/core`)?
5. **Test framework preference** — Vitest (default) or Jest?
6. **CI provider** — GitHub Actions (default), or other?
7. **License** — MIT (default), Apache-2.0, ISC, or other?
8. **Minimum Node.js version** — 18 (default) or 20+?

Use sensible defaults if the user says "defaults" or "just go with defaults."

## Phase 2: Scaffold the Package

Create the following directory structure. Adapt based on Phase 1 answers.

```
<package-name>/
├── src/
│   └── index.ts              # Main entry point
├── tests/
│   └── index.test.ts         # Initial test file
├── .github/
│   └── workflows/
│       └── ci.yml            # CI pipeline
├── .changeset/
│   └── config.json           # Changeset config for versioning
├── package.json
├── tsconfig.json
├── tsconfig.build.json       # Build-only tsconfig (excludes tests)
├── tsup.config.ts            # Build config (dual ESM/CJS)
├── vitest.config.ts          # Or jest.config.ts based on choice
├── eslint.config.mjs         # Flat config ESLint
├── prettier.config.mjs       # Prettier config
├── .gitignore
├── .npmignore                # Or use "files" field in package.json
├── LICENSE
├── README.md
└── CHANGELOG.md
```

### 2.1 — package.json

Generate with these critical fields:

```jsonc
{
  "name": "<package-name>",
  "version": "0.0.0",
  "description": "<from Phase 1>",
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "files": ["dist", "README.md", "LICENSE", "CHANGELOG.md"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build",
    "prepack": "npm run build",
    "changeset": "changeset",
    "release": "changeset publish",
    "version": "changeset version",
    "check": "npm run typecheck && npm run lint && npm run test"
  },
  "engines": {
    "node": ">=18"
  },
  "sideEffects": false,
  "license": "MIT",
  "keywords": [],
  "repository": {
    "type": "git",
    "url": ""
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**Adapt based on Phase 1:**
- If scoped → set name to `@org/package` and ensure `publishConfig.access` is `"public"` (or `"restricted"` if private)
- If browser-only → omit `require` exports, add `"browser"` field
- If multiple subpath exports → add each subpath to `"exports"` map
- If Node 20+ → update `engines` field

### 2.2 — tsconfig.json

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 2.3 — tsconfig.build.json

```jsonc
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "tests", "**/*.test.ts", "**/*.spec.ts"]
}
```

### 2.4 — tsup.config.ts

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs",
    };
  },
});
```

**Adapt:** If multiple entry points from Phase 1, add them to `entry` array.

### 2.5 — vitest.config.ts (default) or jest.config.ts

**Vitest:**
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

**Jest (if chosen):**
```ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
```

### 2.6 — eslint.config.mjs

```js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/", "node_modules/", "coverage/", "*.config.*"],
  }
);
```

### 2.7 — prettier.config.mjs

```js
/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
};
```

### 2.8 — CI Workflow (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  check:
    name: Check
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build

  publish-dry-run:
    name: Publish Dry Run
    runs-on: ubuntu-latest
    needs: check
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm pack --dry-run
```

**Adapt:** Adjust Node versions matrix based on Phase 1 minimum Node version.

### 2.9 — .changeset/config.json

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 2.10 — .gitignore

```
node_modules/
dist/
coverage/
*.tsbuildinfo
.DS_Store
*.local
.env
.env.*
```

### 2.11 — Starter Source (src/index.ts)

Write a minimal, meaningful starter based on the package description from Phase 1. Include:
- At least one exported function with proper TypeScript types
- JSDoc documentation on the export
- A well-defined return type (no implicit `any`)

Example:
```ts
/**
 * Greets the given name.
 *
 * @param name - The name to greet
 * @returns A greeting string
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### 2.12 — Starter Test (tests/index.test.ts)

Write tests for the starter source. Include:
- At least one happy-path test
- At least one edge-case test
- Use `describe`/`it` blocks

### 2.13 — README.md

Generate a README with these sections:
- **Title & badges** (npm version, CI status, license)
- **Install** (`npm install <name>`)
- **Quick Start** (minimal usage example)
- **API** (brief docs for exported functions/types)
- **Development** (how to build, test, lint)
- **Contributing** (link to issues, PR process)
- **License**

### 2.14 — LICENSE

Generate the full license text for the chosen license. Use the current year and ask the user for the copyright holder name (or default to the npm/git user).

### 2.15 — CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

See [Changesets](https://github.com/changesets/changesets) for commit guidelines.
```

## Phase 3: Install Dependencies

Run `npm install` in the package directory to install all dependencies:

**Production dependencies:** none by default (keep it lean).

**Dev dependencies:**
```
typescript tsup @changesets/cli
eslint @eslint/js typescript-eslint
prettier
vitest @vitest/coverage-v8
```

If Jest was chosen instead:
```
typescript tsup @changesets/cli
eslint @eslint/js typescript-eslint
prettier
jest ts-jest @types/jest
```

## Phase 4: Verify Everything Works

Run these commands sequentially and fix any issues before proceeding to the next:

1. `npm run typecheck` — must pass with zero errors
2. `npm run lint` — must pass with zero errors (fix any auto-fixable issues)
3. `npm run test` — must pass
4. `npm run build` — must produce `dist/` with `.mjs`, `.cjs`, `.d.mts`, `.d.cts` files
5. `npm pack --dry-run` — verify the package contents look correct (no test files, no src/)

If any step fails, diagnose and fix before continuing. Do not skip verification.

## Phase 5: Initialize Git

1. `git init`
2. `git add .`
3. Create an initial commit: `chore: initial package scaffold`

## Phase 6: Summary

Present a summary to the user:

```
Package "<name>" created successfully.

  dist outputs:  ESM (.mjs) + CJS (.cjs) + types (.d.mts, .d.cts)
  test runner:   vitest (or jest)
  linter:        eslint (strict TypeScript)
  formatter:     prettier
  versioning:    changesets
  CI:            GitHub Actions (Node 18/20/22)
  license:       MIT

Next steps:
  1. cd <name>
  2. Update package.json "repository" field
  3. npm run dev        — watch mode for development
  4. npx changeset      — create a changeset before publishing
  5. npm publish        — publish to npm (runs build automatically)
```
