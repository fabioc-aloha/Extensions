# TODO — Extensions Monorepo

**Current Sprint**: Sprint 1 — Compile + Publish
**Sprint Goal**: Compile-verify, smoke-test, and publish Hook Studio, Workspace Watchdog, and MCP App Starter.

---

## 🚨 Open — Security (P3)

- [ ] **[P3]** Upgrade `eslint` to v10 to fix 5 high-severity `minimatch` ReDoS vulnerabilities (`@vscode/vsce` + `eslint` dev deps only — not user-facing)

---

## ✅ Done — Audit Confirmed 2026-02-24

All implementation work is complete. These are no longer tasks.

### Marketplace Readiness (resolved 2026-02-24, commit af964da)

- [x] **[P0]** Created `assets/icon.png` (128×128px, AI-generated via Ideogram v2) for all 16 extensions
- [x] **[P0]** Fixed `hook-studio` — icon file deployed and `package.json` verified
- [x] **[P0]** Created `extensions/svg-to-png/assets/banner.svg` + `banner.png` (emerald `#10b981` accent)
- [x] **[P1]** Added `"license": "MIT"` to all 16 `package.json` files
- [x] **[P1]** Added `"repository"` field to all 16 `package.json` files
- [x] **[P1]** Added `"galleryBanner": { "color": "#1a1a2e", "theme": "dark" }` to all 16 `package.json` files
- [x] **[P2]** Added `## Features` section to all 14 READMEs that were missing it
- [x] **[P2]** Added `## Requirements` section to all 13 READMEs that were missing it
- [x] **[P2]** Created `CHANGELOG.md` for all 13 extensions that were missing it

### Implementation (compile-verified 2026-02-24)

- [x] All 15 `extension.ts` files implemented (69–251 lines, real logic)
- [x] `shared/utils/fileObservations.ts` — 166 lines, FileObservationStore + 5 interfaces
- [x] `shared/utils/decay.ts` — 128 lines, DecayEngine with scoring math
- [x] `shared/utils/secretScanner.ts` — SecretScanner class, 50+ regex patterns
- [x] `shared/api/replicate.ts` — ReplicateClient, full prediction flow
- [x] `shared/api/brandfetch.ts` — BrandfetchClient, Logo.dev fallback
- [x] Hook Studio: `HookStudioPanel.ts` (166 lines) + `HookLogProvider.ts`
- [x] Workspace Watchdog: full activate() wired to FileObservationStore
- [x] MCP App Starter: 251-line scaffold wizard (TS/JS/Python templates)
- [x] `.github/` heir deployed v1.0.0 — 9 skills, 4 agents, hooks, instructions

---

## 🔥 Sprint 1 — Shipped ✅ 2026-02-24

### Step 1: Root Setup ✅
- [x] `npm install` from monorepo root — resolve all dependencies
- [x] Verify `tsconfig.json` path resolution for `../../shared/utils/` imports in each extension
- [x] All 16 extensions + shared package compile successfully
- [x] Set up `fabioc-aloha` VSCE publisher credentials — PAT verified
- [x] Create GitHub repo `Extensions` and push

### Step 2: Hook Studio — ✅ Published
- [x] `cd extensions/hook-studio && npm run compile` — fix any TypeScript errors
- [x] Three-tab webview UI implemented (Rule Builder, Execution Log, Condition Tester)
- [x] esbuild bundle — clean 8.4 KB `out/extension.js` with no artifacts
- [x] Packaged as `hook-studio-0.1.0.vsix` (10 files, 275 KB)
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio

### Step 3: CX Workspace Watchdog — ✅ Published
> Note: `workspace-watchdog` name was taken by `deitry` on Marketplace; renamed to `cx-workspace-watchdog`.
- [x] `cd extensions/workspace-watchdog && npm run compile` — fix any TypeScript errors
- [x] esbuild bundle — 15.6 KB including `@alex-extensions/shared` inlined
- [x] Packaged as `cx-workspace-watchdog-0.1.0.vsix` (10 files, 576 KB)
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog

### Step 4: MCP App Starter — ✅ Published
- [x] `cd extensions/mcp-app-starter && npm run compile` — fix any TypeScript errors
- [x] esbuild bundle — clean 7.7 KB `out/extension.js`
- [x] Packaged as `mcp-app-starter-0.1.0.vsix` (10 files, 394 KB)
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter

---

## 📋 Sprint 2 (Next Month)

*All shared utility ports are complete. All 15 extensions compile successfully (2026-02-24).*
*VSCE publisher credentials verified — ready to publish.*

### SecretGuard (`secretScanner.ts` ✅ ported)
- [x] `npm run compile` — verified
- [ ] `npx vsce package` → `code --install-extension` — test locally
- [ ] Verify scan-on-save diagnostics fire correctly
- [ ] Add `.secretguardignore` file parser
- [ ] Implement audit log export (JSON + CSV)
- [ ] Document git pre-commit hook integration in README
- [ ] Publish

### Focus Timer (Pomodoro logic ✅ implemented)
- [x] `npm run compile` — verified
- [ ] `npx vsce package` → `code --install-extension` — test locally
- [ ] Verify status bar timer, pause, stop work correctly
- [ ] Add streak persistence via VS Code `globalState`
- [ ] Verify GitHub Issues sync (optional — can ship without)
- [ ] Publish

### Knowledge Decay Tracker (`decay.ts` ✅ ported)
- [x] `npm run compile` — verified
- [ ] Test frontmatter/comment tag parser (`<!-- review: 90d -->`)
- [ ] Verify status bar badge (overdue count) updates correctly
- [ ] Add GitHub Issues auto-create for overdue docs (optional — ship without)
- [ ] Publish

### Markdown to Word
- [x] `npm run compile` — verified
- [ ] Verify Pandoc install detection (graceful error if missing)
- [ ] Test Mermaid → PNG pre-processing via Mermaid CLI
- [ ] Test right-click context menu in Explorer
- [ ] Publish

### Brandfetch Logo Fetcher (`brandfetch.ts` ✅ ported)
- [x] `npm run compile` — verified
- [ ] Test command palette entry and insert format picker
- [ ] Verify Logo.dev fallback works when Brandfetch returns nothing
- [ ] Publish

### AI Voice Reader
- [x] `npm run compile` — verified
- [ ] Test Web Speech API via Webview (no API key path)
- [ ] Verify per-language voice routing config
- [ ] Publish

---

## 🔭 Sprint 3 (2 Months)

- [ ] Dev Wellbeing — frustration signal detection, Window of Tolerance indicator
- [ ] PPTX Builder — Markdown → slide converter via pptxgenjs
- [ ] Replicate Image Studio — FLUX/SDXL/video generation in chat

---

## 🔭 Sprint 4 (Future)

- [ ] Mermaid Diagram Pro — live preview, error fix, export
- [ ] SVG Toolkit — vectorization, theme-aware color swap, SVGO
- [ ] Gamma Slide Assistant — Marp offline path now; Gamma API when available

---

## Infrastructure ✅

- [x] Set up `shared/` as a proper ts module with its own compilation (`shared/tsconfig.json`, `shared/index.ts`)
- [x] All 15 extensions compile successfully via `npm run compile:all`
- [ ] Add ESLint config shared across all extensions
- [ ] Add `scripts/package-all.sh` — packages all extensions to `dist/`
- [ ] Add `scripts/publish-all.sh` — publishes all extensions sequentially
- [ ] Write `.github/workflows/build.yml` for CI
- [ ] Write `.github/workflows/publish.yml` for Marketplace publish on tag
