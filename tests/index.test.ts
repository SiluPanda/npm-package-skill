import { describe, it, expect } from "vitest";
import { getSkillContent, getSkillMeta, parseSkillMeta, getDefaultInstallPath, SKILL_PATH } from "../src/index.js";
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

  it("falls back to USERPROFILE when HOME is not set", () => {
    const origHome = process.env.HOME;
    delete process.env.HOME;
    process.env.USERPROFILE = "/mock/userprofile";
    try {
      const installPath = getDefaultInstallPath();
      expect(installPath).toMatch(/\/mock\/userprofile\/\.claude\/skills\/npm-package$/);
    } finally {
      process.env.HOME = origHome;
      delete process.env.USERPROFILE;
    }
  });

  it("falls back to empty string when neither HOME nor USERPROFILE is set", () => {
    const origHome = process.env.HOME;
    const origProfile = process.env.USERPROFILE;
    delete process.env.HOME;
    delete process.env.USERPROFILE;
    try {
      const installPath = getDefaultInstallPath();
      expect(installPath).toMatch(/\.claude\/skills\/npm-package$/);
    } finally {
      process.env.HOME = origHome;
      if (origProfile) process.env.USERPROFILE = origProfile;
    }
  });
});

describe("parseSkillMeta", () => {
  it("throws when frontmatter is missing", () => {
    expect(() => parseSkillMeta("no frontmatter here")).toThrow("Could not parse skill frontmatter");
  });

  it("throws for empty string", () => {
    expect(() => parseSkillMeta("")).toThrow("Could not parse skill frontmatter");
  });

  it("returns empty strings for missing fields", () => {
    const meta = parseSkillMeta("---\nunknown: value\n---\n# Content");
    expect(meta.name).toBe("");
    expect(meta.description).toBe("");
    expect(meta.argumentHint).toBe("");
  });

  it("parses valid frontmatter", () => {
    const content = "---\nname: test-skill\ndescription: A test skill\nargument-hint: [arg]\n---\n# Content";
    const meta = parseSkillMeta(content);
    expect(meta.name).toBe("test-skill");
    expect(meta.description).toBe("A test skill");
    expect(meta.argumentHint).toBe("[arg]");
  });
});
