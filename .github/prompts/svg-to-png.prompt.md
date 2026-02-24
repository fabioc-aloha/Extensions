---
description: Convert SVG files to PNG using the resvg-js Rust renderer
mode: agent
agent: Alex
---

# /svg-to-png — SVG to PNG Conversion

> **Avatar**: Call `alex_cognitive_state_update` with `state: "building"`.

Convert SVG files to pixel-perfect PNGs using the Rust-based resvg engine.

## Single File

```powershell
node scripts/svg-to-png.js <input.svg> <output.png> [width]
```

**Examples:**
```powershell
# Natural size
node scripts/svg-to-png.js brand/logos/cx-branding-stamp.svg brand/logos/cx-branding-stamp.png

# Fixed width (banners)
node scripts/svg-to-png.js extensions/focus-timer/assets/banner.svg extensions/focus-timer/assets/banner.png 1280
```

## All Banners (Monorepo)

```powershell
Get-ChildItem extensions/*/assets/banner.svg | ForEach-Object {
  $png = $_.FullName -replace '\.svg$', '.png'
  node scripts/svg-to-png.js $_.FullName $png 1280
  Write-Host "✅ $($_.Directory.Parent.Name)"
}
```

## All Banners + CX Stamp

```powershell
# Step 1: Convert SVGs
Get-ChildItem extensions/*/assets/banner.svg | ForEach-Object {
  $png = $_.FullName -replace '\.svg$', '.png'
  node scripts/svg-to-png.js $_.FullName $png 1280
}

# Step 2: Stamp
$stamp = "brand/logos/cx-branding-stamp.png"
Get-ChildItem extensions/*/assets/banner.png | ForEach-Object {
  magick $_.FullName $stamp -gravity southeast -geometry +20+15 -composite $_.FullName
  Write-Host "🔖 $($_.Directory.Parent.Name)"
}
```

## Rebuild Stamp

```powershell
node scripts/svg-to-png.js brand/logos/cx-branding-stamp.svg brand/logos/cx-branding-stamp.png
```

Then re-stamp all banners.

## VS Code Extension

The `svg-to-png` extension exposes the same engine inside VS Code:
- Right-click any `.svg` → **SVG to PNG: Convert SVG File**
- Command Palette → **SVG to PNG: Convert All SVGs in Workspace**
