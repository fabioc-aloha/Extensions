# Brandfetch Logo Fetcher

![Brandfetch Logo Fetcher Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/brandfetch-logo-fetcher/assets/banner.png)

**Fetch company logos and brand assets by domain — insert as Markdown, SVG URL, or HTML**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.brandfetch-logo-fetcher)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher)

---

## What It Does

Type a domain name, choose your format, and the logo is ready to paste. Powered by Brandfetch API with Logo.dev fallback. LRU cache keeps repeated lookups instant.

## Features

| Feature | Description |
|---|---|
| **Instant logo lookup** | Type a domain, get a logo URL in seconds |
| **Multiple output formats** | Markdown image, SVG URL, PNG URL, or HTML img tag |
| **Logo.dev fallback** | Automatic fallback when Brandfetch returns nothing |
| **LRU cache** | Repeated lookups never hit the network twice |
| **Secure key storage** | API key stored in VS Code SecretStorage, never in settings |
| **Right-click menus** | Right-click anywhere in an editor → **Fetch Logo** or **Insert Logo at Cursor** |

## Requirements

A [Brandfetch API key](https://brandfetch.com/developers) is required for full access (generous free tier). Logo.dev fallback works without a key — set yours via Brandfetch: Set API Key.

## Commands

| Command | Where | Description |
|---|---|---|
| `Brandfetch: Fetch Logo by Domain` | Palette · Editor right-click | Fetch and copy to clipboard |
| `Brandfetch: Insert Logo at Cursor` | Palette · Editor right-click | Insert Markdown image at cursor |
| `Brandfetch: Set API Key` | Palette | Store Brandfetch API key (uses VS Code SecretStorage) |
| `Brandfetch: Clear Logo Cache` | Palette | Clear in-memory LRU cache |

## Output Formats

- **Markdown Image** — `![domain](https://...)`
- **SVG URL** — raw URL for SVG logo
- **PNG URL** — raw URL for PNG logo
- **HTML `<img>`** — full img tag

---

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| **Brandfetch Logo Fetcher** *(this)* | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
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
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
