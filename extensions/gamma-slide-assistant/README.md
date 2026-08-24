# Gamma Slide Assistant

![Gamma Slide Assistant Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/gamma-slide-assistant/assets/banner.png)

**Create presentations from Markdown with local Marp export or an opt-in Gamma.app generation workflow.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.gamma-slide-assistant)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/fabioc-aloha.gamma-slide-assistant)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant)

---

Use [Marp](https://marp.app/) for local HTML and PDF export, or send structured Markdown text to Gamma.app to generate a presentation. The Gamma API path is optional, requires a Gamma Pro-or-higher account, and may consume Gamma credits.

Write slides in Markdown using `---` as separators. Export locally as HTML or PDF, preview in a browser, or generate a Gamma presentation from the same deck.

## Features

- **In-editor slide authoring** — write presentations as Markdown without leaving VS Code
- **Marp rendering** — full Marp spec: themes, pagination, backgrounds, speaker notes
- **One-click export** — HTML, PDF, or browser preview from the Command Palette
- **Starter template** — New Presentation scaffolds the Marp frontmatter automatically
- **Optional Gamma generation** — preserve your Markdown content and use `---` separators as Gamma presentation boundaries
- **SecretStorage API key** — Gamma credentials are stored in VS Code SecretStorage, never in settings
- **Local-first workflow** — Marp export remains available without a Gamma account or network connection

## Usage

1. Run **Gamma Slides: New Presentation** to create a starter deck
2. Write slides using `---` as slide separators
3. Run **Gamma Slides: Export as HTML** or **Gamma Slides: Preview in Browser**

### Generate in Gamma

1. Get a Gamma API key from `gamma.app/settings/api-keys` (Gamma Pro or higher).
2. Run **Gamma Slides: Configure Gamma API Key** once. The key is stored in VS Code SecretStorage.
3. Use `---` between cards or slides, then run **Gamma Slides: Generate Presentation in Gamma**.

Gamma receives Markdown-derived text, not a source file or URL. The extension removes Marp frontmatter before sending content and uses `textMode: preserve` with `cardSplit: inputTextBreaks` to retain your structure.

## Requirements

- Local HTML/PDF export needs Node.js and access to `npx @marp-team/marp-cli`.
- Gamma generation needs a Gamma Pro-or-higher account and API credits.

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
| `Gamma Slides: Generate Presentation in Gamma` | Send Markdown-derived text to Gamma and open the generated presentation |
| `Gamma Slides: Configure Gamma API Key` | Store a Gamma API key in VS Code SecretStorage |

## Settings

| Setting | Default | Description |
|---|---|---|
| `gammaSlides.defaultThemeId` | `` | Optional Gamma theme ID for API-generated presentations |

---

## Related Reading

**From the extension author:** [The Defensible Decision: A Guide to AI-Assisted Business Analytics](https://www.amazon.com/Defensible-Decision-AI-Assisted-Business-Analytics/dp/B0HCLQXLLQ) offers a practical discipline for clear, reviewable AI-assisted presentations and visual analysis.

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Posture, eye-strain, and hydration reminders for long coding sessions | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| Focus Timer | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
| **Gamma Slide Assistant** *(this)* | Create presentations with local Marp export or optional Gamma generation | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
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
