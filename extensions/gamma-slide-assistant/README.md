# Gamma Slide Assistant

![Gamma Slide Assistant Banner](assets/banner.png)

**Write presentations in Markdown, render with Marp — beautiful slides without leaving VS Code**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

> Note: The Gamma.app API is not publicly available. This extension uses [Marp](https://marp.app/) — the best-in-class offline Markdown presentation engine — as the rendering backend.

Write slides in Markdown using `---` as separators. One command exports to HTML, PDF, or launches a browser preview.

## Features

- **In-editor slide authoring** — write presentations as Markdown without leaving VS Code
- **Marp rendering** — full Marp spec: themes, pagination, backgrounds, speaker notes
- **One-click export** — HTML, PDF, or browser preview from the Command Palette
- **Starter template** — New Presentation scaffolds the Marp frontmatter automatically
- **Works offline** — no internet connection or cloud account needed

## Usage

1. Run **Gamma Slides: New Presentation** to create a starter deck
2. Write slides using `---` as slide separators
3. Run **Gamma Slides: Export as HTML** or **Gamma Slides: Preview in Browser**

## Requirements

```bash
npm install -g @marp-team/marp-cli
```

## Slide Format

```markdown
---
marp: true
theme: default
paginate: true
---

# Title Slide

---

## Slide 2

Your content here.
```

## Commands

| Command | Description |
|---|---|
| `Gamma Slides: New Presentation` | Create a starter Marp Markdown file |
| `Gamma Slides: Insert Marp Frontmatter` | Add Marp config to existing file |
| `Gamma Slides: Export as HTML` | Render to standalone HTML |
| `Gamma Slides: Export as PDF` | Render to PDF |
| `Gamma Slides: Preview in Browser` | Open rendered slides in browser |

---

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Posture, eye-strain, and hydration reminders for long coding sessions | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| Focus Timer | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
| **Gamma Slide Assistant** *(this)* | Export Marp Markdown presentations to HTML and PDF | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
| Hook Studio | Visual editor for VS Code hook conditions and automation rules | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio) |
| Knowledge Decay Tracker | Track staleness of documentation and flag overdue reviews | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker) |
| Markdown to Word | Convert Markdown + Mermaid diagrams to .docx via Pandoc | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-markdown-to-word) |
| MCP App Starter | Scaffold Model Context Protocol servers in TypeScript, JavaScript, or Python | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter) |
| Mermaid Diagram Pro | Preview, export, and validate Mermaid diagrams in Markdown files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mermaid-diagram-pro) |
| PPTX Builder | Generate PowerPoint presentations from Markdown using pptxgenjs | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.pptx-builder) |
| Replicate Image Studio | Generate images and videos with FLUX, SDXL, and WAN via Replicate API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio) |
| SecretGuard | Scan workspaces and files for accidentally committed secrets and keys | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
