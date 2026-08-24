# Markdown to Word

![Markdown to Word Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/markdown-to-word/assets/banner.png)

**Convert Markdown to professional Word documents with Pandoc, Mermaid rendering, custom templates, and batch export.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.cx-markdown-to-word)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-markdown-to-word)

---

Turn Markdown into a `.docx` without leaving VS Code. Convert one file, choose an output location, or batch-convert a documentation folder. Use the built-in Markdown preview to review source before export, then apply a Word reference document when your team needs house styles.

## Features

- **Single-file conversion** — convert the active or selected Markdown file to Word
- **Folder conversion** — recursively convert Markdown files while skipping `.git` and `node_modules`
- **Mermaid rendering** — optionally render Mermaid diagrams to PNG before export
- **Custom house styles** — apply a Word reference document for your organization template
- **Built-in source preview** — open the current Markdown file in VS Code's native preview before export
- **Pandoc-powered output** — retain Pandoc support for full Markdown and template conversion

## Requirements

- [Pandoc](https://pandoc.org/installing.html) is required for Word conversion
- [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) is optional and required only when pre-rendering Mermaid diagrams

## Commands

| Command | Description |
|---|---|
| `Markdown to Word: Convert (auto-detect Mermaid)` | Convert active .md to .docx and offer Mermaid pre-rendering |
| `Markdown to Word: Convert With Options` | Choose output path |
| `Markdown to Word: Convert Folder` | Batch-convert a selected folder of Markdown files |
| `Markdown to Word: Open Markdown Preview` | Review the current source using VS Code's built-in Markdown preview |
| `Markdown to Word: Check Pandoc Installation` | Verify pandoc is available |

## Settings

| Setting | Default | Description |
|---|---|---|
| `markdownToWord.pandocPath` | `pandoc` | Path to pandoc |
| `markdownToWord.referenceDoc` | `` | Custom .docx style template |

---

## Related Reading

**From the extension author:** [The Defensible Decision: A Guide to AI-Assisted Business Analytics](https://www.amazon.com/Defensible-Decision-AI-Assisted-Business-Analytics/dp/B0HCLQXLLQ) explores how to produce AI-assisted documents and analyses that serve a named audience, decision, and check.

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
| **Markdown to Word** *(this)* | Convert Markdown + Mermaid diagrams to .docx via Pandoc | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-markdown-to-word) |
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
