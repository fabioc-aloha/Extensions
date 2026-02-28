# CX PWA Icons

CorreaX application icons for PWA manifests, browser favicons, and platform home screens.

> **Law**: Dark background `#0f172a` first. White backgrounds are forbidden.
> **Authority**: [DK-correax-brand.md §2](../../DK-correax-brand.md)

---

## Design Specification

| Property | Value |
|----------|-------|
| Background | `#0f172a` (Slate 900) |
| Corner radius | 12.5% of icon size |
| Mark | `CX` lettermark, sky blue `#38bdf8`, weight 700 |
| Format | SVG source + PNG exports |
| Safe zone | 10% padding from edges |

### Deprecated (do not use)
- ~~`#0078d4` (Azure Blue)~~ — replaced by `#0f172a` dark bg in M2
- ~~`#FFFFFF` (White)~~ — forbidden; dark-first only

---

## Icon Inventory

| Size | File | Platform | Use Case |
|------|------|----------|----------|
| 72×72 | `icon-72x72.svg` | Android | Home screen (legacy) |
| 96×96 | `icon-96x96.svg` | Android | Shortcut icon |
| 128×128 | `icon-128x128.svg` | Chrome | Web Store listing |
| 144×144 | `icon-144x144.svg` | iOS | Home screen |
| 152×152 | `icon-152x152.svg` | iPad | Touch icon |
| 192×192 | `icon-192x192.svg` | Android / PWA | Splash, manifest |
| 384×384 | `icon-384x384.svg` | All | High-DPI displays |
| 512×512 | `icon-512x512.svg` | PWA | Manifest, splash |

---

## Export Requirements

| Platform | Format | Sizes |
|----------|--------|-------|
| PWA manifest | PNG | 192, 512 |
| Android shortcut | PNG | 96, 192 |
| iOS / Safari pinned | PNG | 152, 180 (apple-touch-icon) |
| Browser favicon | ICO | 16, 32, 48 |
| Chrome Web Store | PNG | 128 |

Export pipeline: `@resvg/resvg-js` — see `scripts/generate-brand-assets.ps1`
