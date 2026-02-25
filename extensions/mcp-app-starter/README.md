# MCP App Starter

![MCP App Starter Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/mcp-app-starter/assets/banner.png)

**Scaffold Model Context Protocol (MCP) servers in seconds — TypeScript, JavaScript, or Python**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.mcp-app-starter)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter)

---

## What Is This?

VS Code 1.109 shipped stable MCP server support. Building an MCP server means setting up boilerplate for the SDK, transport, tool handlers, and config. MCP App Starter does all of that in one command.

## Features

| Feature | Description |
|---|---|
| **Guided wizard** | Language picker → name input → instant scaffold |
| **TypeScript template** | Full typed server with tool schemas, tsconfig, package.json |
| **JavaScript template** | Minimal ESM server for lightweight use |
| **Python template** | Server using the official `mcp` package |
| **mcp.json config** | Auto-generates VS Code MCP config ready to paste |
| **Add Tool** | Guided stub for adding new tools |
| **Validate Config** | JSON validator for all `mcp.json` files in workspace |
| **Right-click menus** | Right-click a **folder** → New MCP Server; right-click `.ts/.js/.py` → Add Tool or Add Resource; right-click `.json` → Validate Config |

## Usage

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run **MCP App Starter: New MCP Server** — or right-click a folder in Explorer
3. Choose language → enter name → done
4. Open the README inside your new server for next steps

## Generated TypeScript Structure

```
my-mcp-server/
├── src/
│   └── index.ts      ← Server entry point with hello tool
├── mcp.json          ← VS Code MCP config
├── package.json
├── tsconfig.json
└── README.md
```

## Commands

| Command | Where | Description |
|---|---|---|
| `MCP App Starter: New MCP Server` | Palette · Right-click folder | Full wizard to create an MCP server project |
| `MCP App Starter: Add Tool` | Palette · Right-click `.ts/.js/.py` | Guided stub for adding a new tool |
| `MCP App Starter: Add Resource` | Palette · Right-click `.ts/.js/.py` | Guided stub for adding a new resource |
| `MCP App Starter: Validate MCP Server Config` | Palette · Right-click `.json` | Validate mcp.json files in workspace |
| `MCP App Starter: Open MCP Documentation` | Palette | Open modelcontextprotocol.io |

## Requirements

- VS Code 1.109+
- Node.js 20+ (for TypeScript/JavaScript templates)
- Python 3.10+ (for Python template)

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
| **MCP App Starter** *(this)* | Scaffold Model Context Protocol servers in TypeScript, JavaScript, or Python | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter) |
| Mermaid Diagram Pro | Preview, export, and validate Mermaid diagrams in Markdown files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mermaid-diagram-pro) |
| PPTX Builder | Generate PowerPoint presentations from Markdown using pptxgenjs | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.pptx-builder) |
| Replicate Image Studio | Generate images and videos with FLUX, SDXL, and WAN via Replicate API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio) |
| SecretGuard | Scan workspaces and files for accidentally committed secrets and keys | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard) |
| SVG to PNG | Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick) | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-to-png) |
| SVG Toolkit | Preview, copy as data URI, and validate SVG files in-editor | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit) |
| Workspace Watchdog | Monitor file health, detect stalled work, and surface hot files | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog) |

## License

MIT
