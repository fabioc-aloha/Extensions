# Knowledge Decay Tracker

![Knowledge Decay Tracker Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/knowledge-decay-tracker/assets/banner.png)

**Surface time-decayed knowledge — find docs going stale before they mislead**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.knowledge-decay-tracker)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker)

---

## What It Does

Uses the Forgetting Curve algorithm to score every tracked file by freshness. Files you haven't touched in months surface as `stale` or `critical` so you can review and refresh before they cause confusion.

## Features

| Feature | Description |
|---|---|
| **Forgetting Curve scoring** | Files decay on a configurable half-life schedule |
| **Four decay profiles** | Aggressive (14d), moderate (60d), slow (180d), permanent |
| **Status bar badge** | Overdue file count always visible in the status bar |
| **Staleness report** | Full workspace scan in the output channel |
| **Critical files quick pick** | Jump to worst offenders immediately |
| **Mark as fresh** | Reset the decay clock on reviewed files with one command |
| **Right-click menus** | Right-click any file in Explorer or Editor → **Mark as Fresh** or **Show Report** |

## Requirements

No external tools required. Optionally tag files with a decay profile by adding a comment at the top:

```
<!-- decay: moderate -->
```

## Decay Profiles

| Profile | Half-life | Use case |
|---|---|---|
| `aggressive` | 14 days | Rapidly changing docs |
| `moderate` | 60 days | Standard documentation |
| `slow` | 180 days | Stable reference files |
| `permanent` | Never | Archived/historical content |

## Commands

| Command | Where | Description |
|---|---|---|
| `Knowledge Decay: Scan Workspace` | Palette · Editor right-click | Score all tracked files and generate report |
| `Knowledge Decay: Show Staleness Report` | Palette · Editor right-click | Show output channel report |
| `Knowledge Decay: Show Critical Files` | Palette · Editor right-click | QuickPick of critical-tier files |
| `Knowledge Decay: Mark File as Fresh` | Palette · Right-click any file | Touch current file (reset decay clock) |

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
| **Knowledge Decay Tracker** *(this)* | Track staleness of documentation and flag overdue reviews | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker) |
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
