# Workspace Watchdog

![Workspace Watchdog Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/workspace-watchdog/assets/banner.png)

**A local workspace activity view for hot files, Git changes that remain uncommitted, and TODO/FIXME hotspots.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

## What It Does

Workspace Watchdog records local file-open activity, reads the built-in VS Code Git extension when it is available, and scans common text files for TODO/FIXME comments. It does not write files into your workspace.

## Features

| Feature | Description |
|---|---|
| **Hot Files** | Workspace files opened at least five times in the last seven days |
| **Stalled Changes** | Built-in Git changes that have remained uncommitted for at least 1 day |
| **TODO Hotspots** | Text files with at least three TODO/FIXME comments |
| **Explorer view** | A populated File Health tree with expandable hot-file, stalled-change, and TODO sections |
| **Local scan** | Runs silently at startup and every 30 minutes; **Scan Now** reports its result |
| **Right-click menus** | Run the dashboard or scan command from the CX Tools submenu |

## Stall Severity Tiers

| Tier | Threshold | Action |
|---|---|---|
| Warning | ≥1 day | Listed in the dashboard and Explorer view |
| Alert | ≥3 days | Labeled in the dashboard and Explorer view |
| Critical | ≥7 days | Labeled in the dashboard and Explorer view |

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

Observations are stored in VS Code workspace storage, not in your workspace files. No data leaves your machine. The stalled-change signal is unavailable when VS Code's built-in Git extension is unavailable; hot-file and TODO signals continue to work.

---

## Related Reading

**From the extension author:** [Loop Engineering: A Better Way to Think, Create, and Work with AI](https://www.amazon.com/Loop-Engineering-Better-Create-Applied/dp/B0H8R8GDTJ) examines preserving context, making verification visible, and recognizing the debt left by shortcuts in AI-assisted work.

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Local screen-break, posture, and hydration reminders | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| Focus Timer | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
| Gamma Slide Assistant | Create presentations with local Marp export or optional Gamma generation | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
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
