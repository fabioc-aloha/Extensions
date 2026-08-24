# Hook Studio

![Hook Studio Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/hook-studio/assets/banner.png)

**Visual GUI for VS Code `hooks.json` — the missing tooling for Copilot Chat hooks (VS Code 1.109+)**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.hook-studio)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio)

---

## Why Hook Studio?

VS Code 1.109 shipped Copilot Chat hooks — a powerful system that fires before/after tool calls. But the only way to configure them is by hand-editing `.github/hooks.json`. There is no tooling, no validator, no way to see what fired and why.

Hook Studio fills that gap with a visual, tabbed interface directly inside VS Code.

## Features

| Feature | Description |
|---|---|
| **Rule Builder** | Edit `hooks.json` with syntax highlighting, validation, and save |
| **Execution Log** | See which hooks fired, when, and whether they succeeded |
| **Condition Tester** | Simulate a tool call to preview which hooks would activate |
| **Import from Alex** | One-click import from the Alex Cognitive Architecture hooks |
| **File Watch** | Auto-reloads when `hooks.json` changes externally |
| **Right-click menus** | Right-click any `hooks.json` in Explorer or Editor to access all commands directly |

## Requirements

- VS Code 1.109 or later
- A workspace with `.github/hooks.json` (or create one via **Hook Studio: Open**)

## Usage

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run **Hook Studio: Open** — or right-click any `hooks.json` file and select from the context menu
3. Use the **Rule Builder** tab to edit your hooks
4. Click **Validate** to check JSON syntax
5. Click **Save** to write back to `.github/hooks.json`
6. Use the **Condition Tester** to simulate tool calls before committing

## hooks.json Format

```json
{
  "hooks": [
    {
      "event": "onToolCall",
      "tool": "createFile",
      "when": "always",
      "run": "echo 'File created'"
    }
  ]
}
```

## Commands

| Command | Where | Description |
|---|---|---|
| `Hook Studio: Open` | Palette · Right-click `hooks.json` | Open the visual editor panel |
| `Hook Studio: Test Condition` | Palette · Right-click `hooks.json` | Run condition tester with a tool name |
| `Hook Studio: Import from Alex Hooks` | Palette | Load hooks from Alex architecture |
| `Hook Studio: Export hooks.json` | Palette · Right-click `hooks.json` | Export to a custom path |
| `Hook Studio: Open Execution Log` | Palette · Right-click `hooks.json` | Show log view in Explorer sidebar |

## Extension Settings

No configuration required. Hook Studio auto-activates when `.github/hooks.json` exists in the workspace.

---

## Related Reading

**From the extension author:** [Loop Engineering: A Better Way to Think, Create, and Work with AI](https://www.amazon.com/Loop-Engineering-Better-Create-Applied/dp/B0H8R8GDTJ) explores controls, independent checks, and proportional autonomy for AI-assisted workflows.

## 🔷 CX Tools Suite

Explore more tools from the same suite:

| Extension | Description | Marketplace |
|-----------|-------------|-------------|
| AI Voice Reader | Read files, selections, or documents aloud with Web Speech API | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader) |
| Brandfetch Logo Fetcher | Fetch and insert brand logos from any domain — SVG, PNG, or Markdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher) |
| Dev Wellbeing | Posture, eye-strain, and hydration reminders for long coding sessions | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing) |
| Focus Timer | Pomodoro-style focus and break timer with status bar countdown | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer) |
| Gamma Slide Assistant | Export Marp Markdown presentations to HTML and PDF | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
| **Hook Studio** *(this)* | Visual editor for VS Code hook conditions and automation rules | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio) |
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
