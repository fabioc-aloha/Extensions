# PPTX Builder

![PPTX Builder Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/pptx-builder/assets/banner.png)

**Build branded PowerPoint presentations from Markdown with local themes, speaker notes, and continuation slides.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

Powered by [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Write your presentation in Markdown, choose a local theme, and export a `.pptx` with speaker notes from `<!--notes: ... -->` comments.

## Features

- **Markdown to PowerPoint** — each `##` heading becomes a new slide automatically
- **Three built-in themes** — CX Navy, Corporate, and Minimal themes give each deck a consistent visual system
- **Continuation slides** — long Markdown sections continue onto a labeled follow-up slide instead of being silently truncated
- **Speaker notes** — HTML comment notes become presenter notes
- **Fully local** — no cloud upload, everything runs via pptxgenjs
- **Starter template** — scaffold a presentation.md with one command
- **Slide structure preview** — list all slides in the output channel before exporting

## Slide Format

```markdown
## Slide Title

Your content here. Bullet lists, paragraphs, all supported.

<!--notes: These become speaker notes -->
```

## Commands

| Command | Description |
|---|---|
| `PPTX Builder: Create Presentation from Markdown` | Convert active .md to .pptx |
| `PPTX Builder: New Presentation Template` | Create a starter presentation.md |
| `PPTX Builder: Preview Slide Structure` | List all slides in output channel |
| `PPTX Builder: Select Theme` | Choose the theme for future exports |
| `PPTX Builder: Open pptxgenjs Docs` | Open documentation |

## Requirements

`pptxgenjs` npm package (installed automatically as extension dependency).

## Settings

| Setting | Default | Description |
|---|---|---|
| `pptxBuilder.theme` | `cxNavy` | Theme used for new PowerPoint exports |

---

## Related Reading

**From the extension author:** [The Defensible Decision: A Guide to AI-Assisted Business Analytics](https://www.amazon.com/Defensible-Decision-AI-Assisted-Business-Analytics/dp/B0HCLQXLLQ) shows how to make AI-assisted visual communication serve a clear audience, decision, and review process.

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Posture, eye-strain, and hydration reminders for long coding sessions | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| Focus Timer | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
| Gamma Slide Assistant | Create presentations with local Marp export or optional Gamma generation | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
| Hook Studio | Visual editor for VS Code hook conditions and automation rules | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio) |
| Knowledge Decay Tracker | Track staleness of documentation and flag overdue reviews | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker) |
| Markdown to Word | Convert Markdown + Mermaid diagrams to .docx via Pandoc | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-markdown-to-word) |
| MCP App Starter | Scaffold Model Context Protocol servers in TypeScript, JavaScript, or Python | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter) |
| Mermaid Diagram Pro | Preview, export, and validate Mermaid diagrams in Markdown files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mermaid-diagram-pro) |
| **PPTX Builder** *(this)* | Generate PowerPoint presentations from Markdown using pptxgenjs | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.pptx-builder) |
| Replicate Image Studio | Generate images and videos with FLUX, SDXL, and WAN via Replicate API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio) |
| SecretGuard | Scan workspaces and files for accidentally committed secrets and keys | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
