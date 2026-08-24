# Dev Wellbeing

![Dev Wellbeing Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/dev-wellbeing/assets/banner.png)

**Local, configurable screen-break, posture, and hydration reminders with transparent session details.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

Runs quietly in the background and fires reminders at configurable intervals. While monitoring, it shows the next reminder in the status bar and counts local document edit events for the current VS Code session.

## Features

- **Posture reminders** — gentle nudges to sit up and unclench shoulders
- **Screen-break reminders** — configurable prompts to look away from the editor
- **Hydration nudges** — water reminders at a configurable interval
- **Session details** — monitoring duration and document edit-event count in the output panel
- **Auto-start** — activates on VS Code launch when devWellbeing.enabled is true

## Requirements

No external tools required. Works entirely within VS Code using native notifications.

## Reminders

| Type | Default | Description |
|---|---|---|
| Posture | Every 45m | Sit up, unclench shoulders |
| Screen break | Every 20m | Take a short pause from the editor |
| Hydration | Every 60m | Have some water |

## Commands

| Command | Description |
|---|---|
| `Dev Wellbeing: Start Monitoring` | Start all reminder timers |
| `Dev Wellbeing: Stop Monitoring` | Stop all reminders |
| `Dev Wellbeing: Show Session Stats` | Local monitoring duration + document edit events |
| `Dev Wellbeing: Configure Thresholds` | Open settings |

Auto-starts on VS Code launch if `devWellbeing.enabled` is `true`.

## Privacy and scope

Dev Wellbeing stores no session activity and makes no health, stress, or diagnostic inference. The displayed edit-event count is not a keystroke count; it is a local count of VS Code text-document change events while monitoring is active.

---

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| **Dev Wellbeing** *(this)* | Local screen-break, posture, and hydration reminders | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
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
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
