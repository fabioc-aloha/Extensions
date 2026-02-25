# SecretGuard

![SecretGuard Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/secret-guard/assets/banner.png)

**Pre-commit secret scanner — catch leaked API keys, tokens, and credentials before they leave your machine**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.cx-secret-guard)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard)

---

## What It Does

SecretGuard scans your files for 13 secret patterns — API keys, tokens, private keys, and connection strings — and surfaces findings directly in the Problems panel before they can leave your machine. Scans run automatically on save or on demand across the whole workspace.

## Features

| Feature | Description |
|---|---|
| **Scan on Save** | Automatic scan every time a file is saved |
| **Workspace Scan** | Full sweep on demand via command or right-click |
| **Problems Panel** | Findings appear as errors/warnings with line numbers for quick navigation |
| **Severity levels** | Critical (private keys), High (API tokens), Medium (passwords), Low (URL credentials) |
| **Ignore Patterns** | Glob-based exclusions for test fixtures, example files, and known-safe references |
| **Right-click menus** | Right-click any file → **Scan File** or **Add Ignore Pattern**; right-click a folder → **Scan Workspace** |

## Detected Patterns

| Pattern | Severity |
|---|---|
| RSA / EC / PGP Private Keys | Critical |
| OpenAI API Key | High |
| Replicate API Token | High |
| GitHub PAT / OAuth Token | High |
| Azure API Key | High |
| AWS Access Key ID | High |
| Generic Password | Medium |
| Generic Secret | Medium |
| Database Connection String | Medium |
| URL with Embedded Credentials | Low |

## Requirements

No external tools required. The scanner engine runs entirely within VS Code.

## Commands

| Command | Where | Description |
|---|---|---|
| `SecretGuard: Scan Workspace` | Palette · Explorer right-click | Scan all workspace files |
| `SecretGuard: Scan Current File` | Palette · Right-click any file | Scan the active editor |
| `SecretGuard: View Audit Report` | Palette · Editor right-click | Show output channel log |
| `SecretGuard: Add Ignore Pattern` | Palette · Right-click any file | Exclude a glob pattern |

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
| **SecretGuard** *(this)* | Scan workspaces and files for accidentally committed secrets and keys | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
