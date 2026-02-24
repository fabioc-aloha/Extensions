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

## License

MIT
