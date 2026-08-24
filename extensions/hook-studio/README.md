# Hook Studio

![Hook Studio Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/hook-studio/assets/banner.png)

**Validate and inspect VS Code Copilot hook configuration files, including the current multi-file hooks layout.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Copilot Hooks](https://img.shields.io/badge/Copilot-Hooks-24292f)](https://code.visualstudio.com/docs/agent-customization/hooks)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

## Why Hook Studio?

Hook Studio helps you inspect and draft hook configurations inside VS Code. It provides static validation for the current `.github/hooks/*.json` layout and keeps compatibility with the legacy `.github/hooks.json` file.

## Features

| Feature | Description |
|---|---|
| **Rule Builder** | Edit `hooks.json` with syntax highlighting, validation, and save |
| **Workspace validation** | Check current and legacy hook files for JSON, event, action type, and command issues |
| **Legacy migration** | Copy a legacy hook document into a reviewable `.github/hooks/migrated.json` file without changing the original |
| **Recipe starters** | Create reviewed starter files for formatting, testing, or audit workflows |
| **Static dry run** | Inspect commands and OS overrides for one lifecycle event without executing hooks |
| **Rule Builder** | Edit a hook JSON document with syntax validation and save |
| **Activity output** | Review Hook Studio editor and file-watch activity; VS Code does not expose hook execution telemetry to extensions |
| **File Watch** | Detect changes in `.github/hooks/*.json` and legacy `.github/hooks.json` |
| **Right-click menus** | Right-click any `hooks.json` in Explorer or Editor to access all commands directly |

## Requirements

- VS Code 1.109 or later
- A workspace with `.github/hooks/*.json` or legacy `.github/hooks.json`

## Usage

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run **Hook Studio: Open** — or right-click any `hooks.json` file and select from the context menu
3. Run **Hook Studio: Validate Workspace Hooks** to check lifecycle event names and command actions
4. Use the **Rule Builder** tab to edit hook JSON
5. Click **Validate** to check JSON syntax before saving

## Migration and Recipes

- **Migrate Legacy hooks.json** creates `.github/hooks/migrated.json` and leaves the legacy file untouched. Review and validate the new file before removing the legacy configuration.
- **Create Hook Recipe** writes an additive starter file under `.github/hooks/`. Review every generated command for your repository and operating system before relying on it.

## hooks.json Format

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "echo 'Before tool use'"
      }
    ]
  }
}
```

## Commands

| Command | Where | Description |
|---|---|---|
| `Hook Studio: Open` | Palette · Right-click `hooks.json` | Open the visual editor panel |
| `Hook Studio: Static Dry Run` | Palette · Right-click `hooks.json` | Inspect configured actions for one lifecycle event without executing them |
| `Hook Studio: Open Legacy Workspace hooks.json` | Palette | Load the legacy single-file workspace configuration |
| `Hook Studio: Export hooks.json` | Palette · Right-click `hooks.json` | Export to a custom path |
| `Hook Studio: Open Execution Log` | Palette · Right-click `hooks.json` | Show log view in Explorer sidebar |
| `Hook Studio: Validate Workspace Hooks` | Palette · Right-click `hooks.json` | Validate current and legacy workspace hook files |
| `Hook Studio: Migrate Legacy hooks.json` | Palette · Right-click `hooks.json` | Create a reviewable current-layout migration file |
| `Hook Studio: Create Hook Recipe` | Palette | Create an additive starter recipe under `.github/hooks/` |

## Extension Settings

No configuration required. Hook Studio auto-activates when a hook file exists in `.github/hooks/`.

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
| Gamma Slide Assistant | Create presentations with local Marp export or optional Gamma generation | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.gamma-slide-assistant) |
| **Hook Studio** *(this)* | Validate and inspect VS Code Copilot hook configurations | [Install ↗](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio) |
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
