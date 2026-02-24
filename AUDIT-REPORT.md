# Extensions Monorepo — Audit Report

**Date**: February 24, 2026
**Scope**: 16 extensions | **Auditor**: Alex
**Publisher**: `fabioc-aloha`

---

## Executive Summary

| Dimension | Findings | Target | Grade |
|---|---|---|:---:|
| 1. Console Statements | 2 found, 2 legitimate | <20 | ✅ A+ |
| 2. Dead Code | 0 orphaned commands | 0 | ✅ A+ |
| 3. Sync Blocking I/O | 21 ops across 5 extensions | 0 | 🟡 B+ |
| 4. Menu / Command Coverage | 70/70 commands match | 100% | ✅ A+ |
| 5. Dependencies | 0 unused | 0 unused | ✅ A+ |
| 6. Config / Manifest | 0 mismatches | 0 | ✅ A+ |
| Compile Health | 0 errors, all 16 pass | 0 errors | ✅ A+ |

**Overall Grade: A** — One dimension below A+. ~2.5 hours of async refactoring away from A+.

---

## Extension Inventory

| Extension | Version | Published |
|---|:---:|:---:|
| ai-voice-reader | 0.1.1 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| brandfetch-logo-fetcher | 0.1.1 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| dev-wellbeing | 0.1.0 | ⏳ Not published |
| focus-timer | 0.1.0 | ⏳ Rate-limited — pending |
| gamma-slide-assistant | 0.1.0 | ⏳ Not published |
| hook-studio | 0.1.4 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio) |
| knowledge-decay-tracker | 0.1.1 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker) |
| markdown-to-word | 0.1.0 | ⏳ Rate-limited — pending |
| mcp-app-starter | 0.1.4 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter) |
| mermaid-diagram-pro | 0.1.0 | ⏳ Not published |
| pptx-builder | 0.1.0 | ⏳ Not published |
| replicate-image-studio | 0.1.0 | ⏳ Not published |
| secret-guard | 0.1.1 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| svg-to-png | 0.1.0 | ⏳ Not published |
| svg-toolkit | 0.1.0 | ⏳ Not published |
| workspace-watchdog | 0.1.4 | ✅ [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

---

## Detailed Findings

### 1. Console Statements ✅

**Total**: 2 statements in 1 extension — both legitimate.

| File | Line | Type | Action |
|---|:---:|---|:---:|
| `mcp-app-starter/src/extension.ts` | 157 | `console.error` — error handling | Keep |
| `mcp-app-starter/src/extension.ts` | 186 | `console.error` — error handling | Keep |

No debug scaffolding, no variable dumps. Nothing to remove.

---

### 2. Dead Code ✅

**Orphaned commands**: 0

All 70 commands verified — every `registerCommand()` in source has a matching entry in `package.json` and vice versa.

| Extension | Commands | Status |
|---|:---:|:---:|
| ai-voice-reader | 5 | ✅ |
| brandfetch-logo-fetcher | 4 | ✅ |
| dev-wellbeing | 4 | ✅ |
| focus-timer | 5 | ✅ |
| gamma-slide-assistant | 5 | ✅ |
| hook-studio | 5 | ✅ |
| knowledge-decay-tracker | 4 | ✅ |
| markdown-to-word | 4 | ✅ |
| mcp-app-starter | 5 | ✅ |
| mermaid-diagram-pro | 4 | ✅ |
| pptx-builder | 4 | ✅ |
| replicate-image-studio | 5 | ✅ |
| secret-guard | 4 | ✅ |
| svg-to-png | 3 | ✅ |
| svg-toolkit | 5 | ✅ |
| workspace-watchdog | 5 | ✅ |

---

### 3. Sync Blocking I/O 🟡

**21 synchronous operations** across 5 extensions. All occur inside command handlers — no startup activation penalty — but should be async for correctness and responsiveness.

| Extension | Count | Operations | Notes |
|---|:---:|---|---|
| mcp-app-starter | 15 | `writeFileSync`, `mkdirSync`, `existsSync` | Scaffolding path — one-shot |
| markdown-to-word | 3 | `existsSync` | Pre-flight path checks |
| svg-to-png | 2 | `readFileSync`, `writeFileSync` | Conversion pipeline |
| knowledge-decay-tracker | 2 | `statSync` | File age checks |
| svg-toolkit | 1 | `readFileSync` (in try/catch) | Single file read |

**Recommended fix**: Replace `fs` with `fs-extra` (drop-in async equivalent) and add `await`.

---

### 4. Menu & Command Coverage ✅

**70 / 70 commands structurally verified.** Source handlers and `package.json` declarations are in perfect sync across all 16 extensions.

Runtime smoke testing is covered in [TEST-GUIDE.md](TEST-GUIDE.md) — 7 extensions available on Marketplace for live install testing.

---

### 5. Dependencies ✅

**3 runtime dependencies declared**, all confirmed used:

| Extension | Package | Usage Pattern | Status |
|---|---|---|:---:|
| pptx-builder | `pptxgenjs` | `require('pptxgenjs')` — dynamic | ✅ |
| svg-to-png | `@resvg/resvg-js` | `require('@resvg/resvg-js')` — Rust native | ✅ |
| replicate-image-studio | `@alex-extensions/shared` | `import` — workspace dep | ✅ |

Both `require()` patterns are intentional: `pptxgenjs` for dynamic loading, `@resvg/resvg-js` for native Rust binding compatibility.

---

### 6. Config & Manifest ✅

8 extensions declare configuration properties. All `getConfiguration()` calls reference properly declared sections.

| Extension | Config Keys | Status |
|---|:---:|:---:|
| ai-voice-reader | 3 | ✅ |
| dev-wellbeing | 4 | ✅ |
| focus-timer | 3 | ✅ |
| knowledge-decay-tracker | 2 | ✅ |
| markdown-to-word | 3 | ✅ |
| secret-guard | 3 | ✅ |
| svg-to-png | 3 | ✅ |
| *(8 others)* | 0 | ✅ |

Zero unregistered config updates, zero silent runtime failures.

---

### Compile Health ✅

```
npm run compile:all — exit code 0
All 16 extensions: 0 TypeScript errors
Shared library: 0 TypeScript errors
```

---

## Remediation Plan

| Priority | Extension | Action | Effort |
|:---:|---|---|:---:|
| Medium | mcp-app-starter | Async refactor 15 sync `fs` ops → `fs-extra` | 1h |
| Low | svg-to-png | Async `readFileSync` / `writeFileSync` → `fs.promises` | 30m |
| Low | knowledge-decay-tracker | Async `statSync` → `fs.promises.stat` | 30m |
| Backlog | markdown-to-word | Async `existsSync` checks | 20m |
| Backlog | svg-toolkit | Async `readFileSync` (try/catch path) | 15m |

**Total estimated effort**: ~2.5 hours
**Result**: A → A+

---

## Post-Remediation Checklist

- [ ] `npm run compile:all` → 0 errors
- [ ] Package each refactored extension → `npx vsce package`
- [ ] Install and smoke test locally
- [ ] Patch version bump for each changed extension
- [ ] Update CHANGELOG.md entries

---

## Notes

- Marketplace rate limit (≤4 new extensions per 12h window) blocks `cx-focus-timer` and `cx-markdown-to-word` — both VSIX-ready, awaiting publish window reset.
- `svg-to-png` uses `resvg-js` (Rust renderer) for all SVG→PNG conversion — never ImageMagick (corrupts gradients/paths).
