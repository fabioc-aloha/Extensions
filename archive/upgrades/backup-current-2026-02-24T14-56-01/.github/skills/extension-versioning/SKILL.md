---
name: "extension-versioning"
description: "Semver for VS Code extensions — version bumping, pre-release channel, CHANGELOG format, release cadence"
---

# Extension Versioning Skill

**Trifecta**: Publishing & Release (2 of 3)
**Activation**: version, semver, bump, CHANGELOG, pre-release, release notes, minor, patch, major
**Last Validated**: 2026-02-20

---

## Semantic Versioning for Extensions

Extensions follow standard semver: `MAJOR.MINOR.PATCH`

| Bump | When | Example |
|---|---|---|
| `patch` | Bug fix, performance improvement, wording change | 0.1.0 → 0.1.1 |
| `minor` | New feature, backward compatible | 0.1.1 → 0.2.0 |
| `major` | Breaking change (removes command, changes settings key) | 0.2.0 → 1.0.0 |
| `pre-release` | Any version on the pre-release channel | 0.1.0 (with `--pre-release` flag) |

**First release**: Start at `0.1.0`, not `1.0.0`. Reserve `1.0.0` for "production stable".

---

## Version Bump Workflow

```powershell
# From extension folder

# Check current version
cat package.json | Select-String '"version"'

# Bump patch (0.1.0 → 0.1.1)
npm version patch --no-git-tag-version

# Bump minor (0.1.1 → 0.2.0)
npm version minor --no-git-tag-version

# Or manually edit package.json version field, then:
npm run compile
```

**`--no-git-tag-version`**: Prevents `npm version` from auto-creating a git tag. We create tags manually or via CI.

---

## CHANGELOG.md Format

Follow [Keep a Changelog](https://keepachangelog.com) strictly.

```markdown
# Changelog

All notable changes to Hook Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com)

## [Unreleased]

## [0.2.0] - 2026-03-01
### Added
- Runner tab: execute hooks directly from the GUI
- Log tab: real-time output streaming

### Fixed
- Panel did not restore after VS Code restart (#12)

### Changed
- Renamed command `hookStudio.show` to `hookStudio.open` for consistency

## [0.1.0] - 2026-02-20
### Added
- Initial release
- 3-tab webview: Editor, Runner, Log
- JSON schema validation for hooks.json
- Syntax highlighting in Editor tab

[Unreleased]: https://github.com/fabioc/vs-extensions/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/fabioc/vs-extensions/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/fabioc/vs-extensions/releases/tag/v0.1.0
```

**Rules**:
- `[Unreleased]` section always present at top
- Move unreleased entries to a versioned section on publish
- Subsections: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`
- Entries are user-facing (not commit messages)

---

## Release Cadence Recommendation

| Extension | Cadence |
|---|---|
| P0 (Hook Studio, Watchdog, MCP) | Weekly during active development, stabilize at 0.3.0 |
| P1 (SecretGuard, FocusTimer) | Bi-weekly with feature bundling |
| P2, P3 | Monthly or feature-driven |

**Do not micro-release** (0.1.0 → 0.1.1 → 0.1.2 in one day). Batch fixes into minor releases unless it's a critical bug.

---

## Version Sync Script (All Extensions)

```powershell
# Check all versions
Get-ChildItem -Path "extensions" -Recurse -Filter "package.json" |
    Where-Object { $_.DirectoryName -notmatch "node_modules" } |
    ForEach-Object {
        $pkg = Get-Content $_.FullName | ConvertFrom-Json
        Write-Host "$($pkg.name): $($pkg.version)"
    }
```

---

## VS Code Engine Version Strategy

Lock `engines.vscode` to the minimum version that supports your features:

| Feature Used | Minimum Engine |
|---|---|
| hooks.json support | `^1.109.0` |
| MCP tools API | `^1.109.0` |
| Chat participant API | `^1.90.0` |
| Secret storage | `^1.53.0` |

**Rule**: Use `^1.109.0` for all extensions in this repo, since we target first-mover window on 1.109 features.

---

## Version in Code

Access your own version at runtime:
```typescript
const ext = vscode.extensions.getExtension('fabioc-aloha.hook-studio');
const version = ext?.packageJSON.version as string ?? 'unknown';
outputChannel.appendLine(`Hook Studio v${version} activated`);
```

---

## Git Tagging Convention

After publish:
```powershell
git tag -a "hook-studio/v0.1.0" -m "Hook Studio v0.1.0 — initial release"
git push origin "hook-studio/v0.1.0"
```

Format: `{extension-name}/v{version}` — allows multiple extension tags in the same monorepo without collision.
