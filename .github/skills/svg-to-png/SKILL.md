```skill
---
name: "svg-to-png"
description: "Convert SVG files to pixel-perfect PNGs using resvg-js — the Rust-based SVG renderer"
---

# SVG to PNG Skill

> Accurate, anti-aliased SVG → PNG conversion via the Rust resvg engine.

## Why resvg over ImageMagick

| Problem | ImageMagick | resvg-js |
|---------|-------------|----------|
| Gradient rendering | Often broken at small scale | Accurate |
| Path precision | Lossy interpolation | Full SVG spec |
| System font support | Hit or miss | Yes, with fallback |
| Embedded image handling | Partial | External links supported |
| Error recovery | Silent corruption | Clear error messages |

## The Script

`scripts/svg-to-png.js` — standalone Node.js converter:

```bash
node scripts/svg-to-png.js <input.svg> <output.png> [width]
```

- `width` is optional — omit to use SVG's natural size
- Uses `@resvg/resvg-js` (already in monorepo devDependencies)

## The Extension

`extensions/svg-to-png` — VS Code extension wrapping the same engine:

- Right-click `.svg` → Convert
- Custom width dialog
- Batch convert all SVGs in workspace
- Auto-opens PNG preview
- Settings: `svgToPng.defaultWidth`, `svgToPng.loadSystemFonts`, `svgToPng.openAfterConvert`

## Banner Pipeline (Monorepo)

For generating all 15 extension banners at once:

```powershell
$extensions = @("ai-voice-reader","brandfetch-logo-fetcher","dev-wellbeing","focus-timer",
  "gamma-slide-assistant","hook-studio","knowledge-decay-tracker","markdown-to-word",
  "mcp-app-starter","mermaid-diagram-pro","pptx-builder","replicate-image-studio",
  "secret-guard","svg-toolkit","workspace-watchdog","svg-to-png")
foreach ($ext in $extensions) {
  node scripts/svg-to-png.js "extensions/$ext/assets/banner.svg" "extensions/$ext/assets/banner.png" 1280
}
```

Then stamp with CX branding:

```powershell
$stamp = "brand/logos/cx-branding-stamp.png"
foreach ($ext in $extensions) {
  $png = "extensions/$ext/assets/banner.png"
  magick $png $stamp -gravity southeast -geometry +20+15 -composite $png
}
```

## Stamp Asset

`brand/logos/cx-branding-stamp.svg` — the CorreaX branding element:
- 300×80 viewBox
- Dark gradient background (`#1a1a2e → #0f3460`) matching banner style
- CX logo + "CorreaX" text centered
- Convert with: `node scripts/svg-to-png.js brand/logos/cx-branding-stamp.svg brand/logos/cx-branding-stamp.png`

## Conversion Options (resvg-js)

```javascript
const opts = {
  fitTo: { mode: 'width', value: 1280 },  // scale to width
  font: { loadSystemFonts: true },          // system fonts
  background: 'rgba(0,0,0,0)',              // transparent bg
};
```

## Key Lesson

ImageMagick's `-density` flag scales the rasterization DPI but does NOT improve SVG rendering accuracy — it only changes effective resolution. For path/gradient fidelity, resvg is the only reliable choice in a Node.js environment.
```
