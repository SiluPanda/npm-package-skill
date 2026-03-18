import { describe, it, expect } from "vitest";
import { getSkillContent, getSkillMeta, getDefaultInstallPath, SKILL_PATH } from "../src/index.js";
import { existsSync } from "node:fs";

describe("getSkillContent", () => {
  it("returns the full skill markdown content", () => {
    const content = getSkillContent();
    expect(content).toContain("# Production-Grade npm Package Creator");
    expect(content).toContain("$ARGUMENTS");
  });

  it("includes valid YAML frontmatter", () => {
    const content = getSkillContent();
    expect(content).toMatch(/^---\n[\s\S]*?\n---/);
  });
});

describe("getSkillMeta", () => {
  it("parses the skill name", () => {
    const meta = getSkillMeta();
    expect(meta.name).toBe("npm-package");
  });

  it("parses the description", () => {
    const meta = getSkillMeta();
    expect(meta.description).toContain("production-grade npm package");
  });

  it("parses the argument hint", () => {
    const meta = getSkillMeta();
    expect(meta.argumentHint).toBe("[package-name]");
  });
});

describe("SKILL_PATH", () => {
  it("points to an existing file", () => {
    expect(existsSync(SKILL_PATH)).toBe(true);
  });
});

describe("getDefaultInstallPath", () => {
  it("returns a path ending with .claude/skills/npm-package", () => {
    const installPath = getDefaultInstallPath();
    expect(installPath).toMatch(/\.claude\/skills\/npm-package$/);
  });
});
