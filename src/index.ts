import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Path to the bundled SKILL.md file */
export const SKILL_PATH = resolve(__dirname, "..", "skills", "npm-package", "SKILL.md");

/**
 * Returns the raw content of the npm-package SKILL.md file.
 *
 * @returns The full markdown content of the skill definition
 */
export function getSkillContent(): string {
  return readFileSync(SKILL_PATH, "utf-8");
}

/**
 * Parsed frontmatter from the skill file.
 */
export interface SkillMeta {
  name: string;
  description: string;
  argumentHint: string;
}

/**
 * Extracts the YAML frontmatter metadata from the skill file.
 *
 * @returns Parsed skill metadata
 */
export function getSkillMeta(): SkillMeta {
  const content = getSkillContent();
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  if (!match?.[1]) {
    throw new Error("Could not parse skill frontmatter");
  }

  const frontmatter = match[1];

  const name = /^name:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim() ?? "";
  const description = /^description:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim() ?? "";
  const argumentHint = /^argument-hint:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim() ?? "";

  return { name, description, argumentHint };
}

/**
 * Default install path for the skill in a user's Claude Code config.
 *
 * @returns The path where the skill should be installed (~/.claude/skills/npm-package/)
 */
export function getDefaultInstallPath(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  return resolve(home, ".claude", "skills", "npm-package");
}
