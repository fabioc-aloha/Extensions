# Knowledge Decay Tracker

![Knowledge Decay Tracker Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/knowledge-decay-tracker/assets/banner.png)

**Surface time-decayed knowledge — find docs going stale before they mislead**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Uses the Forgetting Curve algorithm to score every tracked file by freshness. Files you haven't touched in months surface as `stale` or `critical` so you can review and refresh before they cause confusion.

## Features

- **Forgetting Curve scoring** — files decay on a configurable half-life schedule
- **Four decay profiles** — aggressive (14d), moderate (60d), slow (180d), permanent
- **Status bar badge** — overdue file count always visible in the status bar
- **Staleness report** — full workspace scan in the output channel
- **Critical files quick pick** — jump to worst offenders immediately
- **Mark as fresh** — reset the decay clock on reviewed files with one command

## Requirements

No external tools required. Optionally tag files with a decay profile comment at the top of the file: <!-- decay: moderate -->

## Decay Profiles

| Profile | Half-life | Use case |
|---|---|---|
| `aggressive` | 14 days | Rapidly changing docs |
| `moderate` | 60 days | Standard documentation |
| `slow` | 180 days | Stable reference files |
| `permanent` | Never | Archived/historical content |

## Commands

| Command | Description |
|---|---|
| `Knowledge Decay: Scan Workspace` | Score all tracked files and generate report |
| `Knowledge Decay: Show Staleness Report` | Show output channel report |
| `Knowledge Decay: Show Critical Files` | QuickPick of critical-tier files |
| `Knowledge Decay: Mark File as Fresh` | Touch current file (reset decay clock) |

## License

MIT
