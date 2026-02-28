# CorreaX Extensions Brand Guide

<p align="center">
  <img src="logos/logo.svg" alt="CorreaX Logo" width="120">
</p>

<p align="center">
  <strong>v3.0 — Dark-First · DK Authority</strong><br>
  <sub>Supersedes v2.0 (2026-02-28) · Source of truth: <a href="../../Alex_Plug_In/alex_docs/DK-correax-brand.md">DK-correax-brand.md</a></sub>
</p>

---

> **⚠️ Breaking change from v2.0**: "White Background first" and Azure Blue (`#0078d4`) rules are **retired**. Dark-first (`#0f172a`) is now the law. All token values in this guide derive from `DK-correax-brand.md` — when in doubt, check the DK section number cited.

---

## 1. Core Rules (The 5 Laws)

| # | Law | Value |
|---|-----|-------|
| 1 | **Dark first** | Every icon, banner, and UI surface defaults to `#0f172a` background |
| 2 | **DK is authority** | All colors, gradients, and typography come from `DK-correax-brand.md` |
| 3 | **SVG is source** | No PNG-only assets — SVG is always the source, PNG is an export |
| 4 | **CX mark consistent** | CorreaX geometric mark (CX broken circle + chevrons) appears unchanged everywhere |
| 5 | **Category accent colors** | Each extension category uses its designated accent — no ad-hoc color choices |

---

## 2. Palette

All values from **DK §2**.

| Token | Hex | Role |
|-------|-----|------|
| `--bg` | `#0f172a` | Canvas / page background — **always dark** |
| `--bg-card` | `#1e293b` | Card, nav, panel backgrounds |
| `--text` | `#f1f5f9` | Primary text |
| `--text-muted` | `#94a3b8` | Secondary text, captions |
| `--border` | `#334155` | Default border |
| `--accent-indigo` | `#6366f1` | Developer Tools category |
| `--accent-teal` | `#0d9488` | Document & Export category |
| `--accent-rose` | `#f43f5e` | Visual & Graphics category |
| `--accent-coral` | `#f97316` | Productivity category |
| `--sky-blue-hi` | `#38bdf8` | Security & Data category · CX mark gradient top |
| `--sky-blue-lo` | `#0284c7` | CX mark gradient bottom |

**Deprecated — do not use**:

| ❌ Old value | Reason | ✅ Replace with |
|-------------|--------|----------------|
| `#0078d4` Azure Blue top | Legacy logo gradient | `#38bdf8` sky blue |
| `#005a9e` Azure Blue bottom | Legacy logo gradient | `#0284c7` sky blue |
| `#ff6b35` thrust orange | Pre-CorreaX flame color | `#f97316` CorreaX coral |
| `#FFFFFF` white background | v2.0 "white first" rule | `#0f172a` dark base |

---

## 3. Extension Categories & Accent Colors

| Category | Accent | Hex | Extensions |
|----------|--------|-----|------------|
| Developer Tools | Indigo | `#6366f1` | Hook Studio, MCP App Starter, Workspace Watchdog |
| Document & Export | Teal | `#0d9488` | Markdown to Word, PPTX Builder, Gamma Slide Assistant |
| Visual & Graphics | Rose | `#f43f5e` | Mermaid Diagram Pro, SVG Toolkit, SVG to PNG, Replicate Image Studio |
| Productivity | Coral | `#f97316` | Focus Timer, Dev Wellbeing, Knowledge Decay Tracker |
| Security & Data | Sky Blue | `#38bdf8` | Secret Guard, Brandfetch Logo Fetcher |
| Media | Indigo | `#6366f1` | AI Voice Reader |

---

## 4. Icon Template — 128×128

```
┌────────────────────┐
│            [CX]    │  ← CorreaX badge (20% size, 40% opacity) · top-right
│                    │
│      [ GLYPH ]     │  ← White or sky blue, 60% of canvas, centered
│                    │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  │  ← 3px accent bar · bottom · category color
└────────────────────┘
 128×128 · bg #0f172a · rx=20
```

**Glyph assignments** (geometric, 300-weight strokes, legible at 128px):

| Extension | Glyph | Accent |
|-----------|-------|--------|
| ai-voice-reader | Three concentric sound arcs | `#6366f1` |
| brandfetch-logo-fetcher | Tag outline | `#38bdf8` |
| dev-wellbeing | Leaf | `#f97316` |
| focus-timer | Hourglass | `#f97316` |
| gamma-slide-assistant | γ letterform | `#0d9488` |
| hook-studio | Curly braces `{ }` | `#6366f1` |
| knowledge-decay-tracker | Three descending bars | `#f97316` |
| markdown-to-word | Right arrow between two page outlines | `#0d9488` |
| mcp-app-starter | Lightning bolt | `#6366f1` |
| mermaid-diagram-pro | Three connected circles | `#f43f5e` |
| pptx-builder | Three offset rectangles | `#0d9488` |
| replicate-image-studio | Aperture blades | `#f43f5e` |
| secret-guard | Shield | `#38bdf8` |
| svg-to-png | 3×3 dot grid | `#f43f5e` |
| svg-toolkit | Bezier anchor with handles | `#f43f5e` |
| workspace-watchdog | Eye | `#6366f1` |

**Source template**: `brand/logos/icon-template.svg`
**Per-extension icons**: `extensions/{name}/assets/icon.svg` → export `icon.png` at 128×128

---

## 5. Banner Anatomy — 1200×300

```
┌──────────────────────────────────────────────────────┐
│ █  SERIES LABEL (10px/600/uppercase/5px ls)     ALEX │
│    Extension Name (2.25rem / weight 300)              │
│    Short description in muted text                    │
└──────────────────────────────────────────────────────┘
 ↑ 4px left accent bar (category color)    ghost watermark 3% opacity
```

| Property | Value |
|----------|-------|
| Background | `#0f172a` |
| Series label | "CX EXTENSIONS" · `#94a3b8` · 10px / 600 / uppercase / 5px letter-spacing |
| Title | Extension display name · `#f1f5f9` · 2.25rem / weight 300 |
| Subtitle | One-line description · `#94a3b8` · 0.9rem / weight 400 |
| Accent bar | 4px left · category color (§3) |
| Ghost watermark | "ALEX" · `#f1f5f9` at 3% opacity · bottom-right · 6rem |
| Dimensions | 1200×300 (ultra-wide) |

**Source template**: `brand/logos/banner-template.svg`
**Per-extension banners**: `extensions/{name}/assets/banner.svg` → export `banner.png`

---

## 6. Logo & Favicon

| Asset | Location | Notes |
|-------|----------|-------|
| CorreaX rocket logo | `brand/logos/logo.svg` | Sky blue body `#38bdf8 → #0284c7`, flames `#ffc857 → #f97316` |
| Publisher logo (CX mark) | `brand/logos/publisher-logo.svg` | VS Code Marketplace publisher avatar |
| Favicon | `brand/logos/favicon.svg` | CX mark at 32×32, sky blue gradient |
| Publisher PNG | `brand/logos/publisher-logo.png` | 256×256 export — already live on Marketplace |

---

## 7. PWA Icons

8 sizes in `brand/icons/` (`icon-72x72.svg` through `icon-512x512.svg`).

| Property | Value |
|----------|-------|
| Background | `#0f172a` (solid fill, no gradient) |
| Logo mark | CorreaX mark in sky blue `#38bdf8`, centered, 70% of canvas |
| Corner radius | Native — iOS/Android handles clipping |
| Export | PNG at each named size from SVG source |

---

## 8. Context Menus (CX Extensions)

All CX extensions register commands under a shared `cx.tools` submenu:

```json
"submenus": [
  {
    "id": "cx.tools",
    "label": "$(tools) CX Tools"
  }
]
```

**Standard group IDs**:

| Group | Purpose | Examples |
|-------|---------|---------|
| `1_analysis@N` | Scan, lint, validate, audit | SecretGuard scan, Watchdog check |
| `2_transform@N` | Convert, export, resize | Markdown→Word, SVG→PNG |
| `3_generate@N` | Create new content | Image gen, scaffold |
| `4_info@N` | Reports, status | Audit report, decay report |

Both `editor/context` and `explorer/context` must be registered, or explicitly marked N/A in the extension's own README.

---

## 9. Typography

From **DK §3** — authoritative for all VS Code / banner / extension UI surfaces:

```
Font:    'Segoe UI', system-ui, -apple-system, sans-serif
H1:      2.25rem / weight 300  (light — never bold in headers)
Body:    0.9rem / weight 400
Series:  10px / weight 600 / letter-spacing 5px / uppercase
```

---

## 10. File Structure Reference

```
brand/
  logos/
    logo.svg                 ← CorreaX rocket logo (source)
    favicon.svg              ← CX mark favicon (source)
    publisher-logo.svg       ← Marketplace publisher avatar (source)
    publisher-logo.png       ← 256×256 export — live on Marketplace
    icon-template.svg        ← Extension icon template  ← NEW
    banner-template.svg      ← Extension banner template  ← NEW
    banner-extensions.svg    ← Extensions monorepo README banner
  icons/
    icon-72x72.svg  …  icon-512x512.svg   ← dark-first PWA icons
    README.md                             ← PWA usage guide

extensions/{name}/assets/
    icon.svg                 ← Extension icon (source)
    icon.png                 ← 128×128 export
    banner.svg               ← Extension banner (source)
    banner.png               ← 1200×300 export
```

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 3.0 | 2026-02-28 | Full rewrite — dark-first, DK authority, CorreaX palette. Retires all v2.0 white-background and Azure Blue rules |
| 2.0 | 2026-02 | Added Developer/Dark palette, VS Code webview integration |
| 1.0 | — | Initial brand guidelines |
