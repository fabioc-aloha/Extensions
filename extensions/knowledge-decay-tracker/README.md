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

## License

MIT
