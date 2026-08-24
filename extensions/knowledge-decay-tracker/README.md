# Knowledge Decay Tracker

![Knowledge Decay Tracker Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/knowledge-decay-tracker/assets/banner.png)

**Review documentation freshness with configurable decay profiles and local staleness reports.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

## What It Does

Uses configurable decay profiles to surface documents that may need review. A scan combines a document's review date with local activity signals, then reports the lowest-scoring files first. All activity counts and review marks remain in VS Code workspace storage.

## Features

| Feature | Description |
|---|---|
| **Freshness scoring** | Normalized local activity contributes 60%; time since review contributes 40% |
| **Four decay profiles** | Aggressive (14d), moderate (60d), slow (180d), permanent |
| **Status bar badge** | Latest scan's critical/fading count; click it to inspect critical files |
| **Staleness report** | Full workspace scan, sorted from lowest to highest freshness |
| **Critical files quick pick** | Jump to worst offenders immediately |
| **Mark as fresh** | Records a local review timestamp without changing the file's modified time |
| **Startup scan** | A silent scan runs on activation by default; disable it with `knowledgeDecay.autoScan` |
| **Right-click menus** | Right-click any file in Explorer or Editor → **Mark as Fresh** or **Show Report** |

## Requirements

No external tools required. Optionally tag a file's header with a decay profile or explicit review date:

```
<!-- decay: moderate -->
<!-- review: 2026-08-24 -->
```

## Decay Profiles

| Profile | Half-life | Use case |
|---|---|---|
| `aggressive` | 14 days | Rapidly changing docs |
| `moderate` | 60 days | Standard documentation |
| `slow` | 180 days | Stable reference files |
| `permanent` | Never | Archived/historical content |

The `decay:` tag selects the profile for that file. A `review: YYYY-MM-DD` tag supplies its review date; otherwise the local “Mark File as Fresh” timestamp is used, falling back to the file modification time. Opening or saving a tracked file raises only its local activity weight.

## Commands

| Command | Where | Description |
|---|---|---|
| `Knowledge Decay: Scan Workspace` | Palette · Editor right-click | Score all tracked files and generate report |
| `Knowledge Decay: Show Staleness Report` | Palette · Editor right-click | Show output channel report |
| `Knowledge Decay: Show Critical Files` | Palette · Editor right-click | QuickPick of critical-tier files |
| `Knowledge Decay: Mark File as Fresh` | Palette · Right-click any file | Touch current file (reset decay clock) |

---

## Related Reading

**From the extension author:** [Loop Engineering: A Better Way to Think, Create, and Work with AI](https://www.amazon.com/Loop-Engineering-Better-Create-Applied/dp/B0H8R8GDTJ) explores how human-AI work can preserve useful state and make long-running systems more dependable.

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
