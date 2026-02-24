---
description: "VS Code Marketplace publishing workflow, constraints, and best practices for extension deployment"
---

# VS Code Marketplace Publishing Protocol

**Classification**: Procedural Memory | Extension Publishing  
**Activation**: publish extension, vsce, marketplace, package vsix, deploy extension  
**Priority**: CRITICAL for production deployment

---

## Synapses

- [.github/instructions/release-management.instructions.md] (Critical, Coordinates, Bidirectional) - "Parent release workflow this publishing step supports"
- [.github/instructions/brand-asset-management.instructions.md] (High, Constrains, Forward) - "Image format selection affected by marketplace constraints"
- [.github/skills/vscode-extension-patterns/SKILL.md] (Critical, Implements, Bidirectional) - "Extension development patterns this deployment workflow serves"
- [.github/instructions/ui-ux-design.instructions.md] (Medium, Follows, Bidirectional) - "UI polish often immediately precedes marketplace publishing"

---

## Marketplace Constraints (Non-Negotiable)

| Constraint | Requirement | Validation |
|------------|-------------|------------|
| **Image Format** | PNG only for all images in README | SVG rejected during packaging |
| **Inline HTML** | Not supported in headings | Use emojis or text only in titles |
| **Banner Image** | Must be PNG, recommended 1280x640 | Referenced in package.json icon/banner |
| **File Size** | Package should be < 50 MB | Check .vscodeignore for exclusions |
| **Authentication** | PAT token required for publishing | Manage at marketplace.visualstudio.com |

**Common Failures**:
```
ERROR: "SVGs are restricted in README.md; please use other file image formats, such as PNG"
→ Solution: Convert all README images to PNG before packaging

ERROR: "Failed request: (401)"
→ Solution: Use `vsce publish -p <PAT>` with valid Personal Access Token
```

---

## Publishing Workflow

### Phase 1: Pre-Publish Preparation

1. **Version Synchronization**
   - Update `package.json` version
   - Update all platform README files with new version
   - Update `CHANGELOG.md` with release notes
   - Verify version consistency across architecture

2. **Image Format Validation**
   - Scan `platforms/vscode-extension/README.md` for image references
   - Ensure all images are PNG format (no SVG)
   - Verify banner image exists as PNG (1280x640 recommended)
   - Check inline HTML - remove from headings (use emoji instead)

3. **Dependency Audit**
   - Run `npm audit` for security vulnerabilities
   - Update critical dependencies if needed
   - Run `npm install` to ensure lock file is current

4. **Architecture Sync**
   - Heir receives inheritable content from Master
   - Verify skill count: Master - Non-inheritable = Heir expected
   - Contamination check: Ensure no Master-only content in Heir
   - Synapse cleanup: Remove broken or invalid connections

### Phase 2: Build & Package

1. **Compile TypeScript**
   ```powershell
   npm run compile
   ```
   - Runs esbuild for production bundle (dist/)
   - Runs tsc for type checking (no emit)
   - Validates no compilation errors

2. **Package Extension**
   ```powershell
   npx @vscode/vsce package
   ```
   - Creates `.vsix` file (e.g., `alex-cognitive-architecture-5.7.1.vsix`)
   - Runs architecture sync (Master → Heir)
   - Reports package size and file count
   - May fail on marketplace constraints (SVG, file size)

**Expected Output**:
```
DONE  Packaged: alex-cognitive-architecture-5.7.1.vsix (9.45 MB, 431 files)
```

### Phase 3: Pre-Publish Validation

1. **Test Installation Locally**
   ```powershell
   code --install-extension alex-cognitive-architecture-5.7.1.vsix
   ```
   - Verify extension loads without errors
   - Test key commands (Initialize, Dream, Self-Actualization)
   - Check extension view renders correctly

2. **Review Package Contents**
   - Verify `.github/` directory included (skills, instructions, prompts)
   - Check `assets/` directory for required images
   - Confirm `dist/extension.js` bundle exists
   - Validate `package.json` metadata (publisher, repository, icon)

### Phase 4: Publish to Marketplace

1. **Publish Command**
   ```powershell
   npx @vscode/vsce publish -p <PERSONAL_ACCESS_TOKEN>
   ```
   - Requires valid PAT from https://marketplace.visualstudio.com
   - PAT needs `Marketplace (Manage)` scope
   - Token expires - manage at publisher portal

2. **Verify Publication**
   - Extension URL: `https://marketplace.visualstudio.com/items?itemName=<publisher>.<extension-name>`
   - Publisher Hub: `https://marketplace.visualstudio.com/manage/publishers/<publisher>/extensions/<extension-name>/hub`
   - Check listings appear correctly (may take 2-5 minutes to propagate)

3. **Post-Publish Validation**
   - Test installation from marketplace: `code --install-extension fabioc-aloha.alex-cognitive-architecture`
   - Verify version shows correctly in Extensions view
   - Check marketplace page renders images correctly (PNG requirement)

### Phase 5: Post-Publish Documentation

1. **Create GitHub Release**
   ```powershell
   git tag v5.7.1
   git push origin v5.7.1
   ```
   - Create release on GitHub with CHANGELOG excerpt
   - Attach `.vsix` file to release for offline installation

2. **Update Active Context**
   - Mark release complete in `.github/copilot-instructions.md`
   - Update `Last Assessed` date in Active Context
   - Document version in memory for future reference

---

## Authentication Management

### Personal Access Token (PAT) Setup

**Critical: PATs expire frequently** — Create a fresh token before EACH publishing session to avoid 401 errors.

1. Navigate to https://dev.azure.com/fabioc-aloha/_usersSettings/tokens (Azure DevOps, not VS Marketplace)
2. Create new token with:
   - **Name**: "VS Code Marketplace" (or descriptive name)
   - **Organization**: **All accessible organizations** (critical requirement)
   - **Scopes**: **Custom defined** → **Marketplace** → ✅ **Manage**
   - **Expiration**: **30 days** (tokens expire quickly, 30-90 days typical)

3. Copy token immediately (shown only once)

4. Publish with token:
   ```powershell
   npx @vscode/vsce publish -p <YOUR_PAT_TOKEN_HERE>
   ```

**Common Failure: 401 Unauthorized**
```
ERROR  Failed request: (401)
```
→ **Solution**: Your PAT expired or is invalid. Create a new one and retry.

**Security Note**: 
- Never commit PAT token to repository
- Tokens are single-use secrets, create fresh for each session
- If publish succeeds, token is valid; if 401, token expired/invalid

---

## Architecture Sync Process

During `vsce package`, automatic sync runs:

1. **Master → Heir Content Transfer**
   - 105 inheritable skills (116 total - 11 Master-only)
   - 31 instructions
   - 19 prompts
   - 7 agents

2. **Heir Transformations** (10 total):
   - Master-specific content filtered
   - Contamination prevention (no Bootstrap/Initialize in Heir)
   - Synapse validation and cleanup
   - Format standardization

3. **Validation Checks**:
   - Skill count: `Master Total - Non-Inheritable = Heir Expected`
   - Contamination: No Master-only skills in Heir `.github/`
   - Synapse integrity: All targets exist, bidirectional pairs valid
   - File structure: Proper directory organization

**Expected Sync Output**:
```
Copying 105 inheritable skills to heir...
Cleaned 5 synapses with no valid targets
Applied 10 heir transformations
✅ Skill count verified: Master 116, Heir 114, Expected 105 inheritable
✅ Contamination check passed: no contamination detected
```

---

## Troubleshooting Common Issues

### SVG Image Restriction

**Error**: "SVGs are restricted in README.md; please use other file image formats, such as PNG"

**Solution**:
1. Convert SVG banner to PNG: `assets/banner.svg` → `assets/banner.png`
2. Update `platforms/vscode-extension/README.md`:
   ```markdown
   <!-- Before -->
   ![Alex Banner](../../assets/banner.svg)
   
   <!-- After -->
   ![Alex Banner](../../assets/banner.png)
   ```
3. Re-run `vsce package`

### Authentication Failure

**Error**: "Failed request: (401)"

**Solution**:
1. Verify PAT token is valid at marketplace.visualstudio.com
2. Check token has `Marketplace (Manage)` scope
3. Use explicit `-p` flag: `vsce publish -p <TOKEN>`
4. If expired, generate new PAT and retry

### Package Size Too Large

**Error**: Package exceeds 50 MB limit

**Solution**:
1. Review `.vscodeignore` to exclude unnecessary files
2. Add to `.vscodeignore`:
   ```
   .vscode-test/**
   node_modules/**
   archive/**
   exports/**
   article/**
   ```
3. Re-run `vsce package` and verify size

### Broken Marketplace Listing

**Issue**: Images don't render on marketplace page

**Solution**:
1. Ensure all images are PNG format
2. Use relative paths from extension root: `assets/icon.png`
3. Avoid inline HTML - marketplace strips most HTML tags
4. Test locally by viewing README in VS Code before publishing

---

## Best Practices

1. **Always test package locally** before publishing to marketplace
2. **Use PNG for all images** - SVG not supported by marketplace
3. **Keep emoji in headings** - inline HTML images don't render reliably
4. **Validate architecture sync** - check contamination and skill counts
5. **Version everything together** - package.json, READMEs, CHANGELOG in one commit
6. **Test installation** from marketplace after publish to verify propagation
7. **Document in CHANGELOG** - users rely on clear release notes
8. **Tag releases in Git** - enables rollback and version history

---

## Multi-Extension Monorepo Publishing

*Learned from extensions monorepo Sprint 1–2 (2026-02-24). Applies when publishing independent extensions from a shared workspace.*

### Rate Limit Constraint

**Critical**: Marketplace caps **~4 new extension creations per 12-hour window**.

- Patch/minor publishes to **existing** extensions are not affected by this cap
- New extension first-time publishes (new entry on marketplace) count toward the limit
- **Strategy**: Batch 3–4 new extensions per publish session, schedule remaining for next day
- If limit hit: `ERROR Failed request: (429)` or silent rejection — resume 12h later

### Name Collision Strategy

Marketplace extension names are globally unique across all publishers:

```
ERROR  Extension 'focus-timer' already exists in the Marketplace.
→ Solution: Prefix with 'cx-' to make name unique
```

**cx- Prefix Pattern**:
- `focus-timer` taken → rename `cx-focus-timer` in `package.json` (`name` + `displayName`)
- `secret-guard` taken → `cx-secret-guard`
- `workspace-watchdog` taken → `cx-workspace-watchdog`
- **Check before publishing**: Search `https://marketplace.visualstudio.com/search?term=<name>` first

**When collision detected**:
1. Update `package.json`: `"name": "cx-<original>"`, `"displayName": "CX <Original>"`
2. Update README and CHANGELOG to reflect new display name
3. Re-run bundle + publish

### esbuild Inline Bundling (Shared Library Pattern)

When extensions use a workspace-shared library (`@alex-extensions/shared`), bundle it inline:

```powershell
npx esbuild src/extension.ts --bundle --outfile=out/extension.js --external:vscode --platform=node --target=node20 --format=cjs --minify
```

**Key flags**:
- `--bundle`: Inlines all imports including shared library
- `--external:vscode`: Keeps VS Code API as runtime dependency (host provides it)
- `--no-dependencies` flag on `vsce publish` then works correctly (no runtime deps needed)

**Remove shared lib from runtime deps** in `package.json`:
```json
// Before: will fail at install time (workspace package not on npm)
"dependencies": { "@alex-extensions/shared": "*" }

// After: bundled inline, no runtime dependency needed
"dependencies": {}
```

**Required `.vscodeignore` entries** to keep VSIX clean:
```
src/**
tsconfig.json
node_modules/**
**/*.ts
**/*.map
```

### Per-Extension Publish Checklist

For each extension in the monorepo, verify before publishing:

| Step | Item | Command / Check |
|------|------|-----------------|
| 1 | LICENSE exists | `Test-Path extensions/<name>/LICENSE` |
| 2 | `.vscodeignore` exists | `Test-Path extensions/<name>/.vscodeignore` |
| 3 | Name collision check | Search Marketplace for extension name |
| 4 | esbuild scripts in package.json | `"bundle"`, `"package"`, `"publish"` scripts present |
| 5 | Author field set | `"author": "Your Name"` in package.json (drives Marketplace attribution) |
| 6 | README banner uses absolute URL | `https://raw.githubusercontent.com/...` not relative path |
| 7 | CHANGELOG documenting this version | At least `## [0.1.0]` entry present |
| 8 | Bundle succeeds | `npm run bundle` exits 0 |
| 9 | Publish | `npx @vscode/vsce publish --no-dependencies` |

### Author Field (Marketplace Attribution)

Without `"author"` field, the extension appears with no author on the Marketplace listing:

```json
{
  "publisher": "fabioc-aloha",
  "author": "Fabio Correa",   // ← required for Marketplace attribution + publisher-search
  "name": "my-extension"
}
```

To retroactively add author to already-published extensions: add the field and publish a patch version.

---

*Marketplace publishing procedural memory — learned from v5.7.1 production deployment on 2026-02-15; extended with multi-extension monorepo patterns from Sprint 1–2 on 2026-02-24*
