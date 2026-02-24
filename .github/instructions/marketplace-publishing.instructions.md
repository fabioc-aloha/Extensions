# Marketplace Publishing Instructions

**applyTo**: `**/package.json`, `**/*.vsix`, `**/*CHANGELOG*`, `**/*publish*`

---

## Pre-Publish Checklist (MANDATORY)

Run this before EVERY publish — no exceptions:

```powershell
# 1. Inspect package contents — catches accidental secret inclusion
npx vsce ls

# 2. Check .vscodeignore is present and excludes:
# - node_modules/ (unless bundled)
# - .env, *.key, secrets.*
# - test/, .github/, scripts/
# - src/ (only dist/ should ship)

# 3. Verify version matches CHANGELOG entry
# 4. Verify displayName, description, categories in package.json
# 5. Run compile
npm run compile

# 6. Run tests
npm test
```

---

## package.json Required Fields

Every publishable extension must have:

```json
{
  "name": "extension-name",           // lowercase, hyphens only
  "displayName": "Extension Name",    // Title Case, what users see
  "description": "One-line description, max 100 chars",
  "version": "0.0.1",
  "publisher": "fabioc-aloha",
  "engines": { "vscode": "^1.109.0" },
  "categories": ["Other"],            // see valid categories below
  "keywords": ["keyword1", "keyword2"],  // drives marketplace search
  "icon": "assets/icon.png",          // 128x128 PNG required
  "repository": {
    "type": "git",
    "url": "https://github.com/fabioc/vs-extensions"
  },
  "license": "MIT",
  "bugs": { "url": "https://github.com/fabioc/vs-extensions/issues" },
  "homepage": "https://github.com/fabioc/vs-extensions#readme"
}
```

**Valid Categories**: `AI`, `Azure`, `Chat`, `Data Science`, `Debuggers`, `Extension Packs`, `Education`, `Formatters`, `Keymaps`, `Language Packs`, `Linters`, `Machine Learning`, `Notebooks`, `Programming Languages`, `SCM Providers`, `Snippets`, `Testing`, `Themes`, `Visualization`, `Other`

---

## PAT (Personal Access Token) Management

> ⚠️ PATs expire. Create a fresh one before each release session.

**Creating a PAT**:
1. Go to https://dev.azure.com → top-right user → Personal access tokens
2. New Token → Name: `vsce-publish-YYYY-MM-DD`
3. Organization: **All accessible organizations**
4. Scopes → Custom → Marketplace → **Manage** (check)
5. Copy immediately — shown only once

**Store in SecretStorage** (never in `.env`):
```typescript
await context.secrets.store('alex.vsceToken', token);
```

**Or use env var for CLI sessions only**:
```powershell
$env:VSCE_PAT = "your-token"
npx vsce publish
Remove-Item Env:VSCE_PAT  # clean up immediately
```

---

## Publishing Commands

```powershell
# From the extension folder (e.g., extensions/hook-studio/)

# Package only (creates .vsix for local testing)
npx vsce package

# Publish stable
npx vsce publish

# Publish pre-release
npx vsce publish --pre-release

# Publish specific version (avoids interactive prompt)
npx vsce publish 0.1.0

# Dry run — shows what would be published
npx vsce ls
```

---

## CHANGELOG Format (Keep-a-Changelog)

```markdown
# Changelog

## [Unreleased]

## [0.1.0] - 2026-02-20
### Added
- Initial release
- Feature X
- Feature Y

### Fixed
- Bug description (#issue-number)

### Changed
- Breaking change description

[Unreleased]: https://github.com/fabioc/vs-extensions/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/fabioc/vs-extensions/releases/tag/v0.1.0
```

**Rules**:
- New entries go under `[Unreleased]`
- Move from `[Unreleased]` to a version header on publish
- Keep entries user-facing, not technical commit messages

---

## Version Strategy

| Change Type | Version Bump | Example |
|---|---|---|
| Bug fix, minor improvement | `patch` | 0.0.1 → 0.0.2 |
| New feature, backward compatible | `minor` | 0.0.2 → 0.1.0 |
| Breaking change | `major` | 0.1.0 → 1.0.0 |
| Experimental/unstable | `pre-release` | publish `--pre-release` at any stage |

**Pre-release channel** (VS Code Marketplace):
- Users must opt-in to pre-release versions
- Use for: first release of a new extension, experimental features
- Odd minor versions signal pre-release (optional convention)

---

## Gallery Metadata Best Practices

- **icon**: 128x128 PNG. Use the Alex Extensions brand colors if possible.
- **description**: Under 100 chars. Start with a verb: "Visualize", "Monitor", "Generate".
- **keywords**: 5–7 keywords. Include VS Code 1.109-specific keywords for Hook Studio ("hooks.json", "agent hooks", "copilot hooks").
- **categories**: Be accurate. `Other` is fine for unique tools.
- **badge**: Add to README — shows version, install count, rating.

---

## .vscodeignore Template

```
.vscode/**
.vscode-test/**
src/**
test/**
.github/**
scripts/**
*.map
tsconfig*.json
.eslintrc*
.gitignore
node_modules/**
!node_modules/
```

> Note: if you bundle with webpack/esbuild, exclude `node_modules/` entirely and only ship `dist/`.

---

## Post-Publish Verification

1. Search marketplace: https://marketplace.visualstudio.com/search?term=fabioc-aloha
2. Verify description and icon render correctly
3. Install in a clean VS Code window: `code --install-extension fabioc-aloha.extension-name`
4. Smoke test all declared commands
