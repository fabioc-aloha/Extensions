---
name: "marketplace-publishing"
description: "VS Code Marketplace publishing — vsce, PAT management, gallery metadata, pre-release channel, .vscodeignore"
---

# Marketplace Publishing Skill

**Trifecta**: Publishing & Release (1 of 3)
**Activation**: publish, vsce, marketplace, gallery, PAT, .vsix, icon, displayName, categories, pre-release
**Last Validated**: 2026-02-20 | Publisher: fabioc-aloha

---

## VSCE Workflow

```powershell
# Install once globally
npm install -g @vscode/vsce

# Package (creates .vsix — test locally before publish)
npx vsce package

# MANDATORY: inspect what's included before publish
npx vsce ls

# Publish stable
npx vsce publish

# Publish pre-release (VS Code Marketplace pre-release channel)
npx vsce publish --pre-release

# Publish with explicit version
npx vsce publish 0.1.0

# Publish with PAT (avoid interactive prompt in CI)
npx vsce publish --pat $env:VSCE_PAT
```

---

## PAT Lifecycle

PATs expire. **Create new before every publish session**.

1. https://dev.azure.com → top-right avatar → Personal access tokens
2. New Token → Name: `vsce-YYYY-MM-DD` → Organization: **All accessible organizations**
3. Scopes: Custom → Marketplace → **Manage** checked
4. Copy immediately

**Storing for CLI use** (session only, never in files):
```powershell
$env:VSCE_PAT = "your-pat-here"
npx vsce publish
Remove-Item Env:VSCE_PAT   # cleanup after publish
```

**Do NOT** store PAT in `.env`, package.json, or any committed file.

---

## package.json Gallery Metadata

Fields the marketplace displays prominently:

```json
{
  "name": "hook-studio",
  "displayName": "Hook Studio",
  "description": "Visual editor for VS Code agent hooks (hooks.json). Edit, run, and monitor your hook scripts.",
  "version": "0.1.0",
  "publisher": "fabioc-aloha",
  "icon": "assets/icon.png",
  "galleryBanner": {
    "color": "#1e1e2e",
    "theme": "dark"
  },
  "categories": ["Other"],
  "keywords": ["hooks", "hooks.json", "agent hooks", "copilot hooks", "automation"],
  "engines": { "vscode": "^1.109.0" },
  "repository": { "type": "git", "url": "https://github.com/fabioc/vs-extensions" },
  "bugs": { "url": "https://github.com/fabioc/vs-extensions/issues" },
  "license": "MIT"
}
```

**Icon rules**:
- Must be 128×128 pixels, PNG format
- Located at `assets/icon.png` (or as declared in `icon` field)
- Included in package (not in .vscodeignore)

---

## .vscodeignore (What to Exclude)

```
.vscode/**
.vscode-test/**
src/**
test/**
out/test/**
scripts/**
.github/**
*.map
*.ts
!dist/**
tsconfig*.json
.eslintrc*
.prettierrc*
.gitignore
*.vsix
node_modules/**
```

**Critical**: Always run `npx vsce ls` to verify `.vsix` contents before publish.
Expected to see: `dist/`, `package.json`, `README.md`, `CHANGELOG.md`, `LICENSE`, `assets/icon.png`.
**Should NOT see**: `src/`, `node_modules/`, `.env`, any `*.key` file.

---

## Pre-Release Channel

VS Code Marketplace has a stable and pre-release track:

```powershell
npx vsce publish --pre-release
```

- Users must explicitly opt in to receive pre-release versions
- Useful for: shipping Hook Studio before VS Code 1.109 is widely adopted
- Version convention: stable uses even minor (`0.2.0`), pre-release uses odd minor (`0.1.0`, `0.3.0`)
  — This is a convention, not enforced. Use `--pre-release` flag regardless.

---

## README Marketplace Best Practices

The README.md is the extension's marketplace page. Structure:

```markdown
# Extension Name

[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.extension-name)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.extension-name)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/fabioc-aloha.extension-name)](...)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/fabioc-aloha.extension-name)](...)

> One-line value proposition.

## Features
[screenshot or gif]

## Requirements
- VS Code 1.109+
- [Optional: API key for feature X]

## Extension Settings
| Setting | Default | Description |
...

## Release Notes
See [CHANGELOG.md](CHANGELOG.md)
```

---

## Post-Publish Checklist

1. Search: https://marketplace.visualstudio.com/search?term=fabioc-aloha
2. Verify description, icon, categories render correctly
3. Install in clean VS Code: `code --install-extension fabioc-aloha.extension-name@0.1.0`
4. Smoke test all declared commands
5. Check "What's New" panel (shown to users after install/update)

---

## Unpublishing (Use with Caution)

```powershell
# Remove specific version
npx vsce unpublish fabioc-aloha.extension-name@0.0.1

# Remove entire extension (cannot be undone — name reserved for 6 months)
npx vsce unpublish fabioc-aloha.extension-name
```

**Prefer deprecating over unpublishing** — existing users lose the extension if you unpublish.
