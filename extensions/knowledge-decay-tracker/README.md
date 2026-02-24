# Knowledge Decay Tracker

**Surface time-decayed knowledge — find docs going stale before they mislead**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Uses the Forgetting Curve algorithm to score every tracked file by freshness. Files you haven't touched in months surface as `stale` or `critical` so you can review and refresh before they cause confusion.

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

## Source

Decay engine: `shared/utils/decay.ts` (extracted from Alex Cognitive Architecture Forgetting Curve v5.9.6).

## License

MIT
