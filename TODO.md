# TODO — Extensions Monorepo

**Current Sprint**: Sprint 2 — Publish
**Sprint Goal**: Publish all 6 Sprint 2 extensions. 4 live, 2 pending Marketplace rate limit reset (12h).

---

## � Open — Technical Debt

- [ ] **[P2]** `cx-focus-timer`: keyboard shortcut `when` clauses (`focusTimer.running`) never activate because `setContext` calls are missing in `startTimer()`/`stopTimer()`. Add `vscode.commands.executeCommand('setContext', 'focusTimer.running', true/false)` to start/pause handlers and initialize to `false` in `activate()`. See vscode-extension-patterns skill: `setContext for when clauses`.

## �🚨 Open — Security (P3)

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

## 🔥 Sprint 2 — 4/6 Shipped ✅ 2026-02-24

> ⚠️ **Rate limit still active** (2nd attempt 2026-02-24): Marketplace caps new extension creation per 12h window. `cx-focus-timer` and `cx-markdown-to-word` are bundled, renamed, and ready — retry publish tomorrow.

*All shared utility ports are complete. All 15 extensions compile successfully (2026-02-24).*
*VSCE publisher credentials verified — ready to publish.*

### CX SecretGuard (`secretScanner.ts` ✅ ported)
> Note: `secret-guard` name taken on Marketplace; renamed to `cx-secret-guard`.
- [x] esbuild bundle — 15.1 KB including `@alex-extensions/shared` inlined
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard

### CX Focus Timer (Pomodoro logic ✅ implemented)
> Note: `focus-timer` name taken on Marketplace; renamed to `cx-focus-timer`.
- [x] esbuild bundle — 3.1 KB
- [ ] **Publish** (rate limit still active — retry 2026-02-25)

### Knowledge Decay Tracker (`decay.ts` ✅ ported)
- [x] esbuild bundle — 15.5 KB including `@alex-extensions/shared` inlined
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker

### CX Markdown to Word
> Note: `markdown-to-word` name taken on Marketplace; renamed to `cx-markdown-to-word`.
- [x] esbuild bundle — 3.1 KB
- [ ] **Publish** (rate limit still active — retry 2026-02-25)

### Brandfetch Logo Fetcher (`brandfetch.ts` ✅ ported)
- [x] esbuild bundle — 14.6 KB including `@alex-extensions/shared` inlined
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher

### AI Voice Reader
- [x] esbuild bundle — 2.8 KB
- [x] Published → https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader

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
