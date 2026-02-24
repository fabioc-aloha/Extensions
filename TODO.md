# TODO — Extensions Monorepo

**Current Sprint**: Sprint 1 — Compile + Publish
**Sprint Goal**: Compile-verify, smoke-test, and publish Hook Studio, Workspace Watchdog, and MCP App Starter.

---

## ✅ Done — Audit Confirmed 2026-02-24

All implementation work is complete. These are no longer tasks.

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

## 🔥 Immediate — Compile + Publish (This Week)

### Step 1: Root Setup
- [ ] `npm install` from monorepo root — resolve all dependencies
- [ ] Verify `tsconfig.json` path resolution for `../../shared/utils/` imports in each extension
- [ ] Set up `fabioc-aloha` VSCE publisher credentials (`npx vsce login fabioc-aloha`)
- [ ] Create GitHub repo `Extensions` and push

### Step 2: Hook Studio — Ship First (First-Mover Window Open)
- [ ] `cd extensions/hook-studio && npm run compile` — fix any TypeScript errors
- [ ] Fill in HTML webview content in `HookStudioPanel.ts` (`_getHtmlForWebview()`)
- [ ] `F5` — test in Extension Development Host, verify 3 tabs render
- [ ] `npx vsce package` → `npx vsce ls` — confirm no secrets bundled
- [ ] `code --install-extension hook-studio-*.vsix` — smoke test
- [ ] Write README quick-start GIF or screenshot
- [ ] `npx vsce publish`

### Step 3: Workspace Watchdog — Ship Second (2 days)
- [ ] `cd extensions/workspace-watchdog && npm run compile` — fix any TypeScript errors
- [ ] `F5` — verify status bar appears, scan commands work, stalled file notifications fire
- [ ] `npx vsce package` → smoke test → publish

### Step 4: MCP App Starter — Ship Third (3 days)
- [ ] `cd extensions/mcp-app-starter && npm run compile` — fix any TypeScript errors
- [ ] `F5` — run `>MCP App: New Project`, verify wizard flow and file generation
- [ ] `npx vsce package` → smoke test → publish

---

## 📋 Sprint 2 (Next Month)

*All shared utility ports are complete. Sprint 2 is now: compile-verify + polish + publish.*

### SecretGuard (`secretScanner.ts` ✅ ported)
- [ ] `npm run compile` — verify build
- [ ] Test scan-on-save diagnostics fire correctly in Extension Development Host
- [ ] Add `.secretguardignore` file parser
- [ ] Implement audit log export (JSON + CSV)
- [ ] Document git pre-commit hook integration in README
- [ ] Publish

### Focus Timer (Pomodoro logic ✅ implemented)
- [ ] `npm run compile` — verify build
- [ ] Test status bar timer, pause, stop in Extension Development Host
- [ ] Add streak persistence via VS Code `globalState`
- [ ] Verify GitHub Issues sync (optional — can ship without)
- [ ] Publish

### Knowledge Decay Tracker (`decay.ts` ✅ ported)
- [ ] `npm run compile` — verify build
- [ ] Test frontmatter/comment tag parser (`<!-- review: 90d -->`)
- [ ] Verify status bar badge (overdue count) updates correctly
- [ ] Add GitHub Issues auto-create for overdue docs (optional — ship without)
- [ ] Publish

### Markdown to Word
- [ ] `npm run compile` — verify build
- [ ] Verify Pandoc install detection (graceful error if missing)
- [ ] Test Mermaid → PNG pre-processing via Mermaid CLI
- [ ] Test right-click context menu in Explorer
- [ ] Publish

### Brandfetch Logo Fetcher (`brandfetch.ts` ✅ ported)
- [ ] `npm run compile` — verify build
- [ ] Test command palette entry and insert format picker
- [ ] Verify Logo.dev fallback works when Brandfetch returns nothing
- [ ] Publish

### AI Voice Reader
- [ ] `npm run compile` — verify build
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

## Infrastructure

- [ ] Set up `shared/` as a proper ts module with its own compilation
- [ ] Add ESLint config shared across all extensions
- [ ] Add `scripts/package-all.sh` — packages all extensions to `dist/`
- [ ] Add `scripts/publish-all.sh` — publishes all extensions sequentially
- [ ] Write `.github/workflows/build.yml` for CI
- [ ] Write `.github/workflows/publish.yml` for Marketplace publish on tag
