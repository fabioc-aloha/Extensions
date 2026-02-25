# SVG to PNG

![SVG to PNG Banner](assets/banner.png)

**Convert SVG files to pixel-perfect PNGs — Rust-based rendering, batch convert, right-click workflow**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Right-click any `.svg` in the Explorer → **SVG to PNG: Convert SVG File**. Uses [resvg-js](https://github.com/yisibl/resvg-js), a Rust-based renderer that produces accurate, anti-aliased PNGs with full system font support — no ImageMagick, no Inkscape, nothing to install.

## Features

- **Right-click convert** — Explorer context menu on any `.svg` file for instant conversion
- **Custom width** — scale output to any pixel width while preserving aspect ratio
- **Batch convert** — convert every SVG in the workspace with one command
- **Accurate rendering** — Rust/resvg engine handles gradients, paths, and text correctly
- **System fonts** — text in SVGs renders using your installed system fonts
- **Auto-open** — converted PNG opens immediately in VS Code preview

## Requirements

No installation required. The `@resvg/resvg-js` Rust renderer is **bundled with the extension** — no system dependencies, no ImageMagick, no Inkscape needed.

## Usage

### Single File

Right-click any `.svg` file in the Explorer → **SVG to PNG: Convert SVG File**

### Custom Width

Right-click → **SVG to PNG: Convert SVG at Custom Width** → enter pixel width

### Batch

Command Palette (`Ctrl+Shift+P`) → **SVG to PNG: Convert All SVGs in Workspace**

## Commands

| Command | Description |
|---|---|
| `SVG to PNG: Convert SVG File` | Convert the selected SVG to PNG |
| `SVG to PNG: Convert SVG at Custom Width` | Convert at a custom pixel width |
| `SVG to PNG: Convert All SVGs in Workspace` | Batch convert all SVGs in the workspace |

## Settings

| Setting | Default | Description |
|---|---|---|
| `svgToPng.defaultWidth` | `0` | Output width in px (0 = natural SVG size) |
| `svgToPng.loadSystemFonts` | `true` | Load system fonts for text rendering |
| `svgToPng.openAfterConvert` | `true` | Open PNG in preview after conversion |

## Why resvg?

ImageMagick's SVG parser is incomplete and often mangles gradients, paths, and text. resvg-js uses a Rust implementation of the full SVG spec — the same rendering quality as modern browsers, with no lossy interpretation.

---

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Posture, eye-strain, and hydration reminders for long coding sessions | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| Focus Timer | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
| Gamma Slide Assistant | Export Marp Markdown presentations to HTML and PDF | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
| Hook Studio | Visual editor for VS Code hook conditions and automation rules | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio) |
| Knowledge Decay Tracker | Track staleness of documentation and flag overdue reviews | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker) |
| Markdown to Word | Convert Markdown + Mermaid diagrams to .docx via Pandoc | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-markdown-to-word) |
| MCP App Starter | Scaffold Model Context Protocol servers in TypeScript, JavaScript, or Python | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter) |
| Mermaid Diagram Pro | Preview, export, and validate Mermaid diagrams in Markdown files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mermaid-diagram-pro) |
| PPTX Builder | Generate PowerPoint presentations from Markdown using pptxgenjs | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.pptx-builder) |
| Replicate Image Studio | Generate images and videos with FLUX, SDXL, and WAN via Replicate API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio) |
| SecretGuard | Scan workspaces and files for accidentally committed secrets and keys | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| **SVG to PNG** *(this)* | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
