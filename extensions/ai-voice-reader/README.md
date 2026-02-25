# AI Voice Reader

![AI Voice Reader Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/ai-voice-reader/assets/banner.png)

**Text-to-speech for VS Code — read documents, selections, and notes aloud**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.ai-voice-reader)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader)

---

## What It Does

Uses the operating system's built-in TTS engine — no API key required. Automatically strips Markdown syntax before reading so headings and code blocks sound natural.

## Features

| Feature | Description |
|---|---|
| **Read Selection** | Read selected text or the current line with one command |
| **Read Document** | Narrate entire files from start to finish |
| **Markdown-aware** | Strips `#`, `**`, backticks, and code fences before speaking |
| **Cross-platform** | PowerShell TTS on Windows, `say` on macOS, `espeak` on Linux |
| **Configurable speed** | Adjust playback rate from 0.5× to 2.0× |
| **Right-click menus** | Right-click any editor → Read Selection, Read Document, or Stop; right-click in Explorer → Read File |

## Requirements

No external tools required. Uses your operating system's built-in text-to-speech engine.

| OS | Engine | Status |
|---|---|---|
| Windows | `System.Speech.Synthesis` via PowerShell | Pre-installed |
| macOS | `say` command | Pre-installed |
| Linux | `espeak` | `sudo apt install espeak` if missing |

## Commands

| Command | Where | Description |
|---|---|---|
| `Voice Reader: Read Selection` | Palette · Editor right-click (selection) | Read selected text (or current line) |
| `Voice Reader: Read Entire Document` | Palette · Editor right-click | Read the whole active file |
| `Voice Reader: Read File...` | Palette · Explorer right-click | Pick any text file to read |
| `Voice Reader: Stop` | Palette · Editor right-click | Stop playback immediately |
| `Voice Reader: Set Voice` | Palette | Choose from available system voices |

## Settings

| Setting | Default | Description |
|---|---|---|
| `voiceReader.rate` | 1.0 | Speed (0.5–2.0) |
| `voiceReader.stripMarkdown` | true | Remove Markdown before speaking |

---

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| **AI Voice Reader** *(this)* | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
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
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
