#!/usr/bin/env pwsh
# generate-brand-assets.ps1
# Generates all CX extension icon SVGs, banner SVGs, and updates PWA icons.
# Run from C:\Development\Extensions

$root = Split-Path $PSScriptRoot -Parent
$extRoot = Join-Path $root "extensions"

# ── Extension data ────────────────────────────────────────────────────────────
$extensions = @(
    @{ folder = "ai-voice-reader"; name = "CX AI Voice Reader"; accent = "#6366f1"; desc = "Read files aloud with AI voice synthesis" }
    @{ folder = "brandfetch-logo-fetcher"; name = "CX Brandfetch"; accent = "#38bdf8"; desc = "Fetch brand logos and color palettes instantly" }
    @{ folder = "dev-wellbeing"; name = "CX Dev Wellbeing"; accent = "#f97316"; desc = "Gentle nudges for sustainable development" }
    @{ folder = "focus-timer"; name = "CX Focus Timer"; accent = "#f97316"; desc = "Pomodoro-style focus sessions for deep work" }
    @{ folder = "gamma-slide-assistant"; name = "CX Gamma Slides"; accent = "#0d9488"; desc = "Generate Gamma presentations from Markdown" }
    @{ folder = "hook-studio"; name = "CX Hook Studio"; accent = "#6366f1"; desc = "Build and debug VS Code agent hooks.json" }
    @{ folder = "knowledge-decay-tracker"; name = "CX Knowledge Decay"; accent = "#f97316"; desc = "Track knowledge freshness across your codebase" }
    @{ folder = "markdown-to-word"; name = "CX Markdown to Word"; accent = "#0d9488"; desc = "Convert Markdown with diagrams to Word documents" }
    @{ folder = "mcp-app-starter"; name = "CX MCP App Starter"; accent = "#6366f1"; desc = "Scaffold Model Context Protocol server apps" }
    @{ folder = "mermaid-diagram-pro"; name = "CX Mermaid Pro"; accent = "#f43f5e"; desc = "Advanced Mermaid diagram editing and export" }
    @{ folder = "pptx-builder"; name = "CX PPTX Builder"; accent = "#0d9488"; desc = "Generate PowerPoint presentations from Markdown" }
    @{ folder = "replicate-image-studio"; name = "CX Replicate Studio"; accent = "#f43f5e"; desc = "AI image generation powered by Replicate" }
    @{ folder = "secret-guard"; name = "CX Secret Guard"; accent = "#38bdf8"; desc = "Detect and protect secrets in your codebase" }
    @{ folder = "svg-to-png"; name = "CX SVG to PNG"; accent = "#f43f5e"; desc = "Precision SVG to PNG conversion with resvg" }
    @{ folder = "svg-toolkit"; name = "CX SVG Toolkit"; accent = "#f43f5e"; desc = "SVG editing, optimisation, and conversion tools" }
    @{ folder = "workspace-watchdog"; name = "CX Workspace Watchdog"; accent = "#6366f1"; desc = "Monitor workspace activity and health in real time" }
)

# ── Glyph paths (128×128 viewbox, centered around 64,64) ─────────────────────
$glyphs = @{
    "ai-voice-reader"         = @'
  <!-- Sound arcs -->
  <circle cx="50" cy="64" r="8" fill="white"/>
  <path d="M62 52 a18 18 0 0 1 0 24" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M68 46 a26 26 0 0 1 0 36" stroke="white" stroke-width="4.5" fill="none" stroke-linecap="round" opacity="0.85"/>
  <path d="M74 40 a34 34 0 0 1 0 48" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>
'@
    "brandfetch-logo-fetcher" = @'
  <!-- Tag outline -->
  <path d="M42 38 L42 64 L64 86 L86 64 L60 38 Z" stroke="#38bdf8" stroke-width="5" fill="none" stroke-linejoin="round"/>
  <circle cx="54" cy="52" r="7" fill="none" stroke="#38bdf8" stroke-width="4.5"/>
'@
    "dev-wellbeing"           = @'
  <!-- Leaf -->
  <path d="M64 92 C64 92 34 72 40 46 C46 22 64 22 64 22 C64 22 82 22 88 46 C94 72 64 92 64 92 Z" fill="none" stroke="#f97316" stroke-width="5"/>
  <line x1="64" y1="92" x2="64" y2="42" stroke="#f97316" stroke-width="4" opacity="0.7"/>
  <path d="M64 68 Q50 58 46 48" stroke="#f97316" stroke-width="3.5" fill="none" opacity="0.7" stroke-linecap="round"/>
'@
    "focus-timer"             = @'
  <!-- Hourglass -->
  <line x1="40" y1="34" x2="88" y2="34" stroke="#f97316" stroke-width="5.5" stroke-linecap="round"/>
  <line x1="40" y1="94" x2="88" y2="94" stroke="#f97316" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M42 36 L64 64 L86 36" fill="none" stroke="#f97316" stroke-width="5" stroke-linejoin="round"/>
  <path d="M42 92 L64 64 L86 92" fill="none" stroke="#f97316" stroke-width="5" stroke-linejoin="round"/>
  <path d="M55 80 Q64 72 73 80" fill="#f97316"/>
'@
    "gamma-slide-assistant"   = @'
  <!-- γ letterform -->
  <text x="64" y="86" font-family="Georgia, serif" font-size="72" font-weight="700" fill="#0d9488" text-anchor="middle">γ</text>
'@
    "hook-studio"             = @'
  <!-- Curly braces { } -->
  <path d="M60 34 Q50 34 50 44 L50 57 Q50 64 44 64 Q50 64 50 71 L50 84 Q50 94 60 94" stroke="#6366f1" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M68 34 Q78 34 78 44 L78 57 Q78 64 84 64 Q78 64 78 71 L78 84 Q78 94 68 94" stroke="#6366f1" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
'@
    "knowledge-decay-tracker" = @'
  <!-- Three descending bars -->
  <rect x="34" y="44" width="18" height="50" rx="3" fill="#f97316"/>
  <rect x="55" y="56" width="18" height="38" rx="3" fill="#f97316" opacity="0.80"/>
  <rect x="76" y="68" width="18" height="26" rx="3" fill="#f97316" opacity="0.55"/>
'@
    "markdown-to-word"        = @'
  <!-- Page + arrow + page -->
  <rect x="22" y="40" width="28" height="38" rx="3" fill="none" stroke="#0d9488" stroke-width="5"/>
  <line x1="27" y1="53" x2="44" y2="53" stroke="#0d9488" stroke-width="3.5" opacity="0.75"/>
  <line x1="27" y1="61" x2="44" y2="61" stroke="#0d9488" stroke-width="3.5" opacity="0.75"/>
  <line x1="27" y1="69" x2="38" y2="69" stroke="#0d9488" stroke-width="3.5" opacity="0.75"/>
  <path d="M54 64 L74 64 M68 58 L74 64 L68 70" stroke="#0d9488" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="78" y="40" width="28" height="38" rx="3" fill="none" stroke="#0d9488" stroke-width="5"/>
  <line x1="83" y1="53" x2="100" y2="53" stroke="#0d9488" stroke-width="3.5" opacity="0.75"/>
  <line x1="83" y1="61" x2="100" y2="61" stroke="#0d9488" stroke-width="3.5" opacity="0.75"/>
'@
    "mcp-app-starter"         = @'
  <!-- Lightning bolt -->
  <polygon points="72,28 48,68 65,68 56,100 84,56 66,56" fill="#6366f1"/>
'@
    "mermaid-diagram-pro"     = @'
  <!-- Three connected circles -->
  <circle cx="64" cy="38" r="14" fill="none" stroke="#f43f5e" stroke-width="5"/>
  <circle cx="40" cy="82" r="14" fill="none" stroke="#f43f5e" stroke-width="5"/>
  <circle cx="88" cy="82" r="14" fill="none" stroke="#f43f5e" stroke-width="5"/>
  <line x1="55" y1="50" x2="47" y2="71" stroke="#f43f5e" stroke-width="4.5"/>
  <line x1="73" y1="50" x2="81" y2="71" stroke="#f43f5e" stroke-width="4.5"/>
  <line x1="53" y1="82" x2="75" y2="82" stroke="#f43f5e" stroke-width="4.5"/>
'@
    "pptx-builder"            = @'
  <!-- Three offset slide rectangles -->
  <rect x="34" y="56" width="44" height="30" rx="3" fill="none" stroke="#0d9488" stroke-width="5"/>
  <rect x="42" y="48" width="44" height="30" rx="3" fill="none" stroke="#0d9488" stroke-width="4.5" opacity="0.75"/>
  <rect x="50" y="40" width="44" height="30" rx="3" fill="none" stroke="#0d9488" stroke-width="4" opacity="0.5"/>
'@
    "replicate-image-studio"  = @'
  <!-- Aperture blades -->
  <g opacity="0.95">
    <ellipse cx="64" cy="42" rx="8" ry="20" fill="#f43f5e" transform="rotate(0 64 64)"/>
    <ellipse cx="64" cy="42" rx="8" ry="20" fill="#f43f5e" transform="rotate(60 64 64)" opacity="0.85"/>
    <ellipse cx="64" cy="42" rx="8" ry="20" fill="#f43f5e" transform="rotate(120 64 64)" opacity="0.85"/>
    <ellipse cx="64" cy="42" rx="8" ry="20" fill="#f43f5e" transform="rotate(30 64 64)" opacity="0.7"/>
    <ellipse cx="64" cy="42" rx="8" ry="20" fill="#f43f5e" transform="rotate(90 64 64)" opacity="0.7"/>
    <ellipse cx="64" cy="42" rx="8" ry="20" fill="#f43f5e" transform="rotate(150 64 64)" opacity="0.7"/>
  </g>
  <circle cx="64" cy="64" r="11" fill="white" opacity="0.15"/>
  <circle cx="64" cy="64" r="7" fill="none" stroke="#f43f5e" stroke-width="4.5"/>
'@
    "secret-guard"            = @'
  <!-- Shield with checkmark -->
  <path d="M64 30 L88 42 L88 64 Q88 82 64 92 Q40 82 40 64 L40 42 Z" fill="none" stroke="#38bdf8" stroke-width="5.5" stroke-linejoin="round"/>
  <path d="M55 64 L62 71 L76 55" stroke="#38bdf8" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
'@
    "svg-to-png"              = @'
  <!-- 3×3 dot grid -->
  <circle cx="40" cy="40" r="9" fill="#f43f5e"/>
  <circle cx="64" cy="40" r="9" fill="#f43f5e"/>
  <circle cx="88" cy="40" r="9" fill="#f43f5e"/>
  <circle cx="40" cy="64" r="9" fill="#f43f5e"/>
  <circle cx="64" cy="64" r="9" fill="#f43f5e"/>
  <circle cx="88" cy="64" r="9" fill="#f43f5e"/>
  <circle cx="40" cy="88" r="9" fill="#f43f5e"/>
  <circle cx="64" cy="88" r="9" fill="#f43f5e"/>
  <circle cx="88" cy="88" r="9" fill="#f43f5e"/>
'@
    "svg-toolkit"             = @'
  <!-- Bezier anchor with handles -->
  <line x1="64" y1="64" x2="36" y2="44" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/>
  <line x1="64" y1="64" x2="92" y2="84" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/>
  <circle cx="36" cy="44" r="8" fill="none" stroke="#f43f5e" stroke-width="4.5"/>
  <circle cx="92" cy="84" r="8" fill="none" stroke="#f43f5e" stroke-width="4.5"/>
  <rect x="58" y="58" width="12" height="12" rx="2" fill="none" stroke="#f43f5e" stroke-width="4.5"/>
'@
    "workspace-watchdog"      = @'
  <!-- Eye -->
  <path d="M20 64 Q40 36 64 36 Q88 36 108 64 Q88 92 64 92 Q40 92 20 64 Z" fill="none" stroke="#6366f1" stroke-width="5"/>
  <circle cx="64" cy="64" r="17" fill="none" stroke="#6366f1" stroke-width="5"/>
  <circle cx="64" cy="64" r="8" fill="#6366f1"/>
'@
}

# ── Icon generator ─────────────────────────────────────────────────────────────
function Get-IconSvg($folder, $accent) {
    $glyph = $glyphs[$folder]
    return @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Glyph scaled 1.4× around centre — minimal padding, maximum presence -->
  <g transform="translate(64 64) scale(1.4) translate(-64 -64)">
$glyph
  </g>
  <!-- Accent bar bottom -->
  <rect x="0" y="125" width="128" height="3" fill="$accent"/>
</svg>
"@
}

# ── Banner generator ────────────────────────────────────────────────────────────
function Get-BannerSvg($name, $accent, $desc) {
    return @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300">
  <rect width="1200" height="300" fill="#0f172a"/>
  <!-- Accent bar left -->
  <rect x="0" y="0" width="4" height="300" fill="$accent"/>
  <!-- Ghost watermark -->
  <text x="1180" y="252" font-family="'Segoe UI', system-ui, sans-serif" font-size="96" font-weight="700" fill="#f1f5f9" opacity="0.03" text-anchor="end">ALEX</text>
  <!-- Series label -->
  <text x="40" y="80" font-family="'Segoe UI', system-ui, sans-serif" font-size="10" font-weight="600" fill="#94a3b8" letter-spacing="5">CX EXTENSIONS</text>
  <!-- Extension name -->
  <text x="40" y="148" font-family="'Segoe UI', system-ui, sans-serif" font-size="40" font-weight="300" fill="#f1f5f9">$name</text>
  <!-- Description -->
  <text x="40" y="190" font-family="'Segoe UI', system-ui, sans-serif" font-size="16" font-weight="400" fill="#94a3b8">$desc</text>
</svg>
"@
}

# ── Write icon-template.svg ────────────────────────────────────────────────────
$templatePath = Join-Path $root "brand\logos\icon-template.svg"
@'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Template: replace {{GLYPH}} and {{ACCENT}} -->
  <rect width="128" height="128" rx="20" fill="#0f172a"/>
  <!-- {{GLYPH}} — white or category accent, scaled 1.4× around centre, minimal padding -->
  <g transform="translate(64 64) scale(1.4) translate(-64 -64)">
    <text x="64" y="72" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">GLYPH GOES HERE</text>
  </g>
  <!-- Accent bar bottom (3px) — fill = category accent color -->
  <rect x="0" y="125" width="128" height="3" fill="{{ACCENT}}"/>
</svg>
'@ | Set-Content $templatePath -Encoding UTF8
Write-Host "✅ icon-template.svg"

# ── Write banner-template.svg ──────────────────────────────────────────────────
$bannerTemplatePath = Join-Path $root "brand\logos\banner-template.svg"
@'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300">
  <!-- Template: replace {{ACCENT}}, {{NAME}}, {{DESC}} -->
  <rect width="1200" height="300" fill="#0f172a"/>
  <!-- Accent bar left (4px) — fill = category accent color -->
  <rect x="0" y="0" width="4" height="300" fill="{{ACCENT}}"/>
  <!-- Ghost watermark -->
  <text x="1180" y="252" font-family="'Segoe UI', system-ui, sans-serif" font-size="96" font-weight="700" fill="#f1f5f9" opacity="0.03" text-anchor="end">ALEX</text>
  <!-- Series label: 10px / 600 / uppercase / 5px letter-spacing -->
  <text x="40" y="80" font-family="'Segoe UI', system-ui, sans-serif" font-size="10" font-weight="600" fill="#94a3b8" letter-spacing="5">CX EXTENSIONS</text>
  <!-- Extension name: 40px / 300 weight -->
  <text x="40" y="148" font-family="'Segoe UI', system-ui, sans-serif" font-size="40" font-weight="300" fill="#f1f5f9">{{NAME}}</text>
  <!-- Description: 16px / 400 weight / muted -->
  <text x="40" y="190" font-family="'Segoe UI', system-ui, sans-serif" font-size="16" font-weight="400" fill="#94a3b8">{{DESC}}</text>
</svg>
'@ | Set-Content $bannerTemplatePath -Encoding UTF8
Write-Host "✅ banner-template.svg"

# ── Generate per-extension icons and banners ───────────────────────────────────
foreach ($ext in $extensions) {
    $assetsDir = Join-Path $extRoot "$($ext.folder)\assets"
    if (-not (Test-Path $assetsDir)) { New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null }

    # icon.svg
    $iconPath = Join-Path $assetsDir "icon.svg"
    Get-IconSvg -folder $ext.folder -accent $ext.accent | Set-Content $iconPath -Encoding UTF8

    # banner.svg
    $bannerPath = Join-Path $assetsDir "banner.svg"
    Get-BannerSvg -name $ext.name -accent $ext.accent -desc $ext.desc | Set-Content $bannerPath -Encoding UTF8

    Write-Host "✅ $($ext.folder)"
}

# ── Update PWA icons (brand/icons/) ───────────────────────────────────────────
$iconSizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$iconsDir = Join-Path $root "brand\icons"

$cxMark = @'
  <!-- CorreaX mark: CX text centered, sky blue -->
  <text x="50%" y="55%" font-family="'Segoe UI', system-ui, sans-serif" dominant-baseline="middle" text-anchor="middle"
        font-size="{SIZE}" font-weight="700" fill="#38bdf8">CX</text>
'@

foreach ($size in $iconSizes) {
    $pwaPath = Join-Path $iconsDir "icon-${size}x${size}.svg"
    $fontSize = [int]($size * 0.38)
    $mark = $cxMark -replace '\{SIZE\}', $fontSize
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $size $size" width="$size" height="$size">
  <rect width="$size" height="$size" fill="#0f172a"/>
$mark</svg>
"@
    $svg | Set-Content $pwaPath -Encoding UTF8
    Write-Host "✅ icon-${size}x${size}.svg"
}

Write-Host ""
Write-Host "Done. All brand assets generated."
Write-Host "Next: run resvg exports for icon.png and banner.png per extension."
