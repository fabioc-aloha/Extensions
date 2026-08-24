# Focus Timer

![Focus Timer Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/focus-timer/assets/banner.png)

**Local Pomodoro timer with keyboard shortcuts, status-bar sessions, and break reminders.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.cx-focus-timer)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/fabioc-aloha.cx-focus-timer)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer)

---

25-minute work sessions. 5-minute breaks. Long break every 4 sessions. All in the status bar, all via commands. No web UI, no sign-in, no distractions.

## Features

- **Pomodoro timer in the status bar** — always visible, never intrusive
- **Customizable cadence** — configure work, short break, and long break durations
- **Auto long break** — triggers automatically after 4 completed work sessions
- **Session history** — log of all completed sessions for the current VS Code session
- **Pause/resume** — click the status bar item or use the command to pause mid-sprint

## Requirements

No external tools required. Works entirely within VS Code.

## Usage

1. `Focus Timer: Start Focus Session` — starts the countdown in status bar
2. Click the status bar item to pause/resume
3. `Focus Timer: Start Break` — short (5m) or long break (15m after 4 sessions)
4. `Focus Timer: Show Session History` — log of all completed sessions

## Settings

| Setting | Default | Description |
|---|---|---|
| `focusTimer.workMinutes` | 25 | Work session length |
| `focusTimer.shortBreakMinutes` | 5 | Short break length |
| `focusTimer.longBreakMinutes` | 15 | Long break length |

---

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Posture, eye-strain, and hydration reminders for long coding sessions | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| **Focus Timer** *(this)* | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
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
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
