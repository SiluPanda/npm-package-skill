#!/usr/bin/env node

import { mkdirSync, copyFileSync, existsSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SKILL_SOURCE = resolve(__dirname, "..", "skills", "npm-package", "SKILL.md");

function getInstallDir(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  return resolve(home, ".claude", "skills", "npm-package");
}

function install(): void {
  const installDir = getInstallDir();
  const dest = resolve(installDir, "SKILL.md");

  if (existsSync(dest)) {
    console.log(`Skill already exists at ${dest}`);
    console.log("Use --force to overwrite.");
    return;
  }

  mkdirSync(installDir, { recursive: true });
  copyFileSync(SKILL_SOURCE, dest);
  console.log(`Installed npm-package skill to ${dest}`);
  console.log("You can now use /npm-package in Claude Code.");
}

function forceInstall(): void {
  const installDir = getInstallDir();
  const dest = resolve(installDir, "SKILL.md");

  mkdirSync(installDir, { recursive: true });
  copyFileSync(SKILL_SOURCE, dest);
  console.log(`Installed npm-package skill to ${dest}`);
  console.log("You can now use /npm-package in Claude Code.");
}

function uninstall(): void {
  const installDir = getInstallDir();

  if (!existsSync(installDir)) {
    console.log("Skill is not installed.");
    return;
  }

  rmSync(installDir, { recursive: true });
  console.log("Uninstalled npm-package skill.");
}

function printHelp(): void {
  console.log(`
npm-package-skill - Install the npm-package Claude Code skill

Usage:
  npx npm-package-skill [command]

Commands:
  install     Install the skill to ~/.claude/skills/ (default)
  uninstall   Remove the skill from ~/.claude/skills/
  help        Show this help message

Options:
  --force     Overwrite existing skill file during install
`);
}

const args = process.argv.slice(2);
const command = args[0] ?? "install";
const hasForce = args.includes("--force");

switch (command) {
  case "install":
    if (hasForce) {
      forceInstall();
    } else {
      install();
    }
    break;
  case "uninstall":
    uninstall();
    break;
  case "help":
  case "--help":
  case "-h":
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
}
