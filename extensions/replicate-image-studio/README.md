# Replicate Image Studio

![Replicate Image Studio Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/replicate-image-studio/assets/banner.png)

**Generate images and video in VS Code, preserve local history, and insert results as Markdown.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.replicate-image-studio)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/fabioc-aloha.replicate-image-studio)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio)

---

Type a prompt, choose a model, get an image URL, then insert it as Markdown or save it locally. Generation history is retained locally across VS Code restarts.

## Features

- **Multi-model generation** — Flux Schnell, Flux Dev, SDXL, and WAN 2.1 video
- **Insert as Markdown** — generated image URLs inserted at cursor with one click
- **Persistent local history** — the latest 50 generations remain available across VS Code restarts
- **Negative prompts** — optionally describe elements to avoid before generating an image
- **Secure key storage** — API key in VS Code SecretStorage, never in settings.json
- **Prompt from selection** — selected text pre-fills the generation prompt

## Requirements

A [Replicate API key](https://replicate.com/account/api-tokens) is required. Set it via the Replicate: Set API Key command.

## Models

| Model | Speed | Quality |
|---|---|---|
| Flux Schnell | Fast | Good |
| Flux Dev | Slow | Excellent |
| SDXL | Medium | Great |
| WAN 2.1 | Slow | Video |

## Commands

| Command | Description |
|---|---|
| `Replicate: Generate Image` | Prompt → image → copy Markdown |
| `Replicate: Generate Video (WAN)` | Prompt → video URL |
| `Replicate: Set API Key` | Store key via VS Code SecretStorage |
| `Replicate: View Generation History` | Show session log |
| `Replicate: Insert Last Image as Markdown` | Insert at cursor |

---

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
| PPTX Builder | Generate PowerPoint presentations from Markdown using pptxgenjs | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.pptx-builder) |
| **Replicate Image Studio** *(this)* | Generate images and videos with FLUX, SDXL, and WAN via Replicate API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio) |
| SecretGuard | Scan workspaces and files for accidentally committed secrets and keys | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
