---
description: "SVG to PNG conversion — use resvg-js (Rust renderer), never ImageMagick for SVG sources"
applyTo: "**/*.svg,**/assets/**,**/banner*,**/scripts/svg-to-png*"
---

# SVG to PNG Conversion Instructions

## Golden Rule

**Always use `scripts/svg-to-png.js` (or the `svg-to-png` extension) — never `magick` for SVG input.**

ImageMagick's SVG parser is incomplete. It mangles gradients, clips paths, and corrupts logos at non-native scales.

## The Script

```powershell
node scripts/svg-to-png.js <input.svg> <output.png> [width]
```

| Argument | Required | Description |
|----------|----------|-------------|
| `input.svg` | Yes | Source SVG file |
| `output.png` | Yes | Destination PNG path |
| `width` | No | Target width in px (maintains aspect ratio) |

## Banner Regeneration

When any `banner.svg` changes, regenerate with width=1280:
```powershell
node scripts/svg-to-png.js extensions/<name>/assets/banner.svg extensions/<name>/assets/banner.png 1280
```

For all 15+ banners at once:
```powershell
Get-ChildItem extensions/*/assets/banner.svg | ForEach-Object {
  $png = $_.FullName -replace '\.svg$', '.png'
  node scripts/svg-to-png.js $_.FullName $png 1280
}
```

## CX Stamp

After regenerating, composite the CX branding stamp:
```powershell
$stamp = "brand/logos/cx-branding-stamp.png"
Get-ChildItem extensions/*/assets/banner.png | ForEach-Object {
  magick $_.FullName $stamp -gravity southeast -geometry +20+15 -composite $_.FullName
}
```

Note: `magick` composite (not conversion) is fine for PNG→PNG operations.

## Adding a New Extension Banner

1. Create `extensions/<name>/assets/banner.svg` (1280×320 viewBox, dark gradient)
2. Run: `node scripts/svg-to-png.js extensions/<name>/assets/banner.svg extensions/<name>/assets/banner.png 1280`
3. Stamp: `magick extensions/<name>/assets/banner.png brand/logos/cx-branding-stamp.png -gravity southeast -geometry +20+15 -composite extensions/<name>/assets/banner.png`

## When to Update the Stamp

The stamp source lives at `brand/logos/cx-branding-stamp.svg`. After editing it:
```powershell
node scripts/svg-to-png.js brand/logos/cx-branding-stamp.svg brand/logos/cx-branding-stamp.png
```
Then re-run the stamp loop on all banners.
