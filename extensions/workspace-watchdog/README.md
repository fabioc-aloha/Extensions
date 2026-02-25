# Workspace Watchdog

![Workspace Watchdog Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/workspace-watchdog/assets/banner.png)

**Background file health monitor — surface stalled work, uncommitted patterns, and TODO hotspots**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.cx-workspace-watchdog)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog)

---

## What It Does

Workspace Watchdog silently watches your files in the background and alerts you when work is going stale. No more forgotten branches or files you opened two weeks ago and never committed.

## Features

| Feature | Description |
|---|---|
| **Hot Files** | Files you open most often — your actual working set |
| **Stalled Files** | Files with uncommitted changes sitting >1d/3d/7d |
| **TODO Hotspots** | Files with the most TODO/FIXME comments |
| **Health Dashboard** | Green/Yellow/Red workspace health at a glance |
| **Passive scan** | Runs every 30 minutes in background, no manual action needed |
| **Right-click menus** | Right-click any folder in Explorer → **Show Dashboard** or **Scan Now** without opening the Palette |

## Stall Severity Tiers

| Tier | Threshold | Action |
|---|---|---|
| Warning | >1 day | Listed in dashboard |
| Alert | >3 days | Visible in sidebar |
| Critical | >7 days | Toast notification |

## Commands

| Command | Where | Description |
|---|---|---|
| `Workspace Watchdog: Show Dashboard` | Palette · Right-click folder | Open health dashboard in output panel |
| `Workspace Watchdog: Scan Now` | Palette · Right-click folder | Force immediate scan |
| `Workspace Watchdog: Hot Files` | Palette | QuickPick of most-opened files |
| `Workspace Watchdog: Stalled Files` | Palette | QuickPick of stalled files |
| `Workspace Watchdog: Clear History` | Palette | Reset all tracking data |

## Requirements

No external tools required. Works entirely within VS Code using the local file system. No cloud connection, no sign-in.

## Data Storage

Observations are stored locally in `.github/episodic/peripheral/file-observations.json`. No data leaves your machine.

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
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| **Workspace Watchdog** *(this)* | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
