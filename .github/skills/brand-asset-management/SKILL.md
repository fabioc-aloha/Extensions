---
name: "brand-asset-management"
description: "Brand hierarchy, visual identity, asset deployment, platform-specific branding guidelines"
---

# Brand Asset Management Skill

Expert in Alex brand hierarchy, visual identity systems, asset deployment, and platform-specific branding guidelines.

## Capabilities

- Manage brand hierarchy (CorreaX → Alex → Platform heirs)
- Deploy and maintain visual assets (banners, logos, icons)
- Apply platform-specific branding guidelines
- Generate persona-based marketing copy
- Maintain GK premium branding (space station metaphor)
- Ensure brand consistency across heirs

## When to Use This Skill

- User mentions "branding", "logo", "banner", or "assets"
- Creating or updating marketplace listings
- Deploying visual identity to new platforms
- Reviewing brand consistency across heirs
- Generating persona-targeted copy

## Core Concepts

### Brand Hierarchy

| Level | Brand | Symbol | Usage |
|-------|-------|--------|-------|
| Parent | CorreaX | C split X mark | Footer attribution, legal |
| Product | Alex | A Negative Space Rocket | All Alex-specific assets |
| Platform | Per-heir | Logo variants | VS Code, M365, GitHub |

### Locked Brand Elements

| Element | Value |
|---------|-------|
| Tagline | "Strap a Rocket to Your Back" |
| Subtitle Template | "Take Your [NOUN] to New Heights" |
| Primary Icon | `$(rocket)` codicon |
| Colors | sky blue (#38bdf8) + coral (#f97316) + indigo (#6366f1) — CorreaX dark palette |

### GK Premium Branding

| Tier | Symbol | Meaning |
|------|--------|---------|
| Standard | A Negative Space Rocket | Individual project acceleration |
| Premium (GK) | Knowledge Graph Network | Cross-project knowledge hub |
| GK Tagline | "Your MISSION CONTROL for Cross-Project Wisdom" |
| GK Colors | teal (#0d9488) + teal-light (#2dd4bf) — CorreaX knowledge tier |

### Asset Locations

| Asset | Path | Purpose |
|-------|------|---------|
| Animated Banner | `.github/assets/banner.svg` | GitHub READMEs |
| Static Banner | `assets/banner.png` | Marketplace fallback |
| Extension Icon | `platforms/vscode-extension/assets/icon.png` | Marketplace icon |
| Mono Logo | `platforms/vscode-extension/assets/logo-mono.svg` | Activity bar |
| M365 Color | `platforms/m365-copilot/appPackage/color.png` | Teams color icon |
| M365 Outline | `platforms/m365-copilot/appPackage/outline.png` | Teams outline icon |

### Platform Guidelines

| Platform | Format | Key Requirement |
|----------|--------|-----------------|
| GitHub | Animated SVG | 20s cycle, 10 personas, crossfade |
| VS Code Marketplace | Static PNG | `icon.png` (A Negative Space Rocket) |
| M365 Teams | Static PNG | color.png (192×192), outline.png (32×32) |

### Store Description Pattern

```
🚀 STRAP A ROCKET TO YOUR BACK
[Hook]
━━━ [PLATFORM] vs [PLATFORM] + ALEX ━━━
▸ Capability: Before → After
━━━ WHY ALEX? ━━━
━━━ TAKE YOUR [NOUN] TO NEW HEIGHTS ━━━
[Persona → Benefit mappings]
━━━ LAUNCH SEQUENCES ━━━
[Bottom line. Stop walking. Start flying.]
```

### Persona Copy Mapping

| Persona | Pain | Alex Benefit |
|---------|------|--------------|
| Developer | Re-explaining context | Ship faster, skills remember architecture |
| Researcher | Literature scattered | Hypothesis → publication, accelerated |
| Grad Student | Thesis overwhelm | Literature review on autopilot |
| Tech Writer | Docs fall behind code | Docs that write themselves |
| DevOps | Manual infra, config drift | Same infra, every time |
| PM | Status chasing | 4-6× faster estimates |
| Content Creator | Ideas scattered | Ideas → posts in minutes |

### Heir-Specific Positioning

| Heir | Compares Against | Bottom Line |
|------|------------------|-------------|
| VS Code | GitHub Copilot | "GitHub Copilot = Powerful autocomplete → + Alex = Rocket strapped to your back" |
| M365 | M365 Copilot | "M365 Copilot = Powerful AI toolbox → + Alex = Personal AI that grows with you" |

## PNG Generation

**ImageMagick (preferred for complex SVG)**:
```powershell
magick -density 200 -background none banner.svg banner.png
```

**Sharp CLI (faster for simple SVG)**:
```powershell
npx sharp-cli --input source.svg --output output.png -f png --density 150
```

### SVG Banner Best Practices

| Technique | Recommendation |
|-----------|----------------|
| **Gradient IDs** | Use unique IDs per SVG (`cxGrad`, `bgGrad`) to avoid conflicts |
| **Logo scaling** | 0.75 scale renders cleanly; 0.5 can distort during PNG conversion |
| **Embedding logos** | Embed actual SVG paths rather than text approximations |
| **Render density** | Density 200 for marketplace; density 150 for previews |
| **Banner dimensions** | 1280×320 px for VS Code Marketplace banners |

### Embedded Logo Pattern

```xml
<g transform="translate(1095, 268)">
  <defs>
    <linearGradient id="cxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <g transform="scale(0.75)">
    <!-- Logo paths here -->
  </g>
  <text x="32" y="18" font-family="Segoe UI" font-size="12" fill="rgba(255,255,255,0.4)">CorreaX</text>
</g>
```

## Example Prompts

- "Update the marketplace description"
- "Generate persona copy for the VS Code store"
- "Check brand consistency across heirs"
- "Create a banner for the new platform"

## Input Expectations

- Platform target (VS Code, M365, GitHub, GK)
- Asset type (banner, logo, icon, copy)
- Persona focus (optional)

## Output Format

- Asset files deployed to correct locations
- Brand guideline compliance report
- Generated copy following store description pattern
