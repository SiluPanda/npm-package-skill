# npm-package-skill

[![CI](https://github.com/SiluPanda/npm-package-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/SiluPanda/npm-package-skill/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/npm-package-skill.svg)](https://www.npmjs.com/package/npm-package-skill)
<img src="https://img.shields.io/npm/dt/npm-package-skill?color=brightgreen&label=downloads" alt="npm downloads" />
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An AI coding agent skill that scaffolds production-grade npm packages in seconds. One command sets up TypeScript, dual ESM/CJS output, testing, linting, CI/CD, and publishing configuration — so you can skip the boilerplate and start building.

Works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Cursor](https://cursor.com), [Windsurf](https://windsurf.com), [Codex](https://openai.com/index/codex), [Antigravity](https://antigravity.dev), and any AI coding agent that can follow markdown instructions.

## What You Get

Every package scaffolded by this skill includes:

| Feature | Details |
|---|---|
| **TypeScript** | Strict mode, declaration maps, isolated modules |
| **Dual output** | ESM (`.mjs`) + CJS (`.cjs`) via [tsup](https://tsup.egoist.dev) |
| **Testing** | [Vitest](https://vitest.dev) (or Jest) with 80% coverage thresholds |
| **Linting** | [ESLint](https://eslint.org) flat config with strict TypeScript rules |
| **Formatting** | [Prettier](https://prettier.io) |
| **Versioning** | [Changesets](https://github.com/changesets/changesets) for semantic versioning |
| **CI/CD** | GitHub Actions testing Node 20/22 + publish dry-run on PRs |
| **Package exports** | Proper conditional `exports` map with types for both ESM and CJS |

## Install

### Claude Code (Quick Install)

```bash
npx npm-package-skill
```

This copies the skill into `~/.claude/skills/npm-package/` so it's available in all your Claude Code sessions.

### Cursor

Copy the skill file into your Cursor rules directory:

```bash
mkdir -p ~/.cursor/rules
cp skills/npm-package/SKILL.md ~/.cursor/rules/npm-package.md
```

Or add it as a project-level rule by copying to `.cursor/rules/npm-package.md` in your repo.

### Windsurf

Copy the skill file into your Windsurf rules:

```bash
cp skills/npm-package/SKILL.md ~/.windsurf/rules/npm-package.md
```

Or add it to your project as `.windsurfrules` or `.windsurf/rules/npm-package.md`.

### Codex

Copy the skill file so Codex can reference it:

```bash
cp skills/npm-package/SKILL.md AGENTS.md
```

Or reference it in your existing `AGENTS.md`.

### Antigravity / Other Agents

Copy `skills/npm-package/SKILL.md` into whichever directory your agent reads for instructions (e.g., project root or a rules/prompts directory). The skill is plain markdown — any agent that can follow structured instructions will work.

### Install via npm

```bash
npm install -g npm-package-skill
npm-package-skill install
```

## Usage

### Claude Code

Use the `/npm-package` slash command:

```
/npm-package my-awesome-lib
```

### Cursor / Windsurf / Codex / Other Agents

Paste or reference the skill content and ask:

```
Follow the npm-package skill to scaffold a package called my-awesome-lib
```

The agent will walk you through a brief discovery phase (package description, runtime target, test framework, license, etc.) and then scaffold a complete, verified, publish-ready package.

### What the Skill Does

1. **Discovery** — Asks targeted questions to tailor the scaffold to your needs
2. **Scaffold** — Creates 15+ files: source, tests, configs, CI, README, LICENSE, CHANGELOG
3. **Install** — Runs `npm install` with all dev dependencies
4. **Verify** — Runs typecheck, lint, test, build, and `npm pack --dry-run` sequentially
5. **Git init** — Initializes the repo with an initial commit

### Programmatic API

You can also use the package programmatically:

```ts
import { getSkillContent, getSkillMeta, getDefaultInstallPath } from "npm-package-skill";

// Get the raw skill markdown
const content = getSkillContent();

// Get parsed metadata
const meta = getSkillMeta();
// => { name: "npm-package", description: "...", argumentHint: "[package-name]" }

// Get the default install path
const path = getDefaultInstallPath();
// => "/Users/you/.claude/skills/npm-package"
```

## CLI Reference

```
npx npm-package-skill [command] [options]

Commands:
  install       Install the skill to ~/.claude/skills/ (default)
  uninstall     Remove the skill from ~/.claude/skills/
  help          Show help

Options:
  --force       Overwrite an existing skill file
```

## Development

```bash
git clone https://github.com/SiluPanda/npm-package-skill.git
cd npm-package-skill
npm install

npm run dev           # Watch mode
npm run build         # Build ESM + CJS + types
npm run test          # Run tests
npm run test:coverage # Run tests with coverage
npm run lint          # Lint with ESLint
npm run format        # Format with Prettier
npm run typecheck     # Type-check with TypeScript
npm run check         # Run all checks (typecheck + lint + test)
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run `npm run check` to ensure everything passes
5. Create a changeset (`npx changeset`) describing your change
6. Open a pull request

See [issues](https://github.com/SiluPanda/npm-package-skill/issues) for things to work on.

## License

[MIT](LICENSE)
