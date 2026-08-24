# CorreaX Extension Icon System

## Purpose

Marketplace icons must remain recognizable at card scale while forming one
cohesive extension family.

## Icon Construction

- Canvas: `128 x 128` transparent SVG and PNG.
- Surface: a `108 x 108` dark navy (`#0f172a`) rounded square inset by `10 px`.
- Glyph safe area: `34 px` to `94 px` on both axes.
- Accent bar: centered at the bottom of the surface; extension-specific accent
  colors distinguish categories without changing the system.
- Strokes: rounded caps and joins, `6 px` default weight.

## Source of Truth

`scripts/generate-icons.mjs` produces every
`extensions/*/assets/icon.svg` and `icon.png` pair. Run:

```bash
node scripts/generate-icons.mjs
```

Do not hand-edit generated icon assets. Update the generator, render the full
set, and inspect the Marketplace-scale contact sheet before publishing.
