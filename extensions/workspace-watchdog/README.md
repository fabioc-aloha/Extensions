# Workspace Watchdog

![Workspace Watchdog Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/workspace-watchdog/assets/banner.png)

**Background file health monitor — surface stalled work, uncommitted patterns, and TODO hotspots**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)

---

## What It Does

Workspace Watchdog silently watches your files in the background and alerts you when work is going stale. No more forgotten branches or files you opened two weeks ago and never committed.

## Features

| Feature | Description |
|---|---|
| **Hot Files** | Files you open most often — your actual working set |
| **Stalled Files** | Files with uncommitted changes sitting >1d/3d/7d |
| **TODO Hotspots** | Files with the most TODO/FIXME comments |
| **Health Dashboard** | Green/Yellow/Red workspace health at a glance |
| **Passive scan** | Runs every 30 minutes in background, no manual action needed |

## Stall Severity Tiers

| Tier | Threshold | Action |
|---|---|---|
| Warning | >1 day | Listed in dashboard |
| Alert | >3 days | Visible in sidebar |
| Critical | >7 days | Toast notification |

## Commands

| Command | Description |
|---|---|
| `Workspace Watchdog: Show Dashboard` | Open health dashboard in output panel |
| `Workspace Watchdog: Scan Now` | Force immediate scan |
| `Workspace Watchdog: Hot Files` | QuickPick of most-opened files |
| `Workspace Watchdog: Stalled Files` | QuickPick of stalled files |
| `Workspace Watchdog: Clear History` | Reset all tracking data |

## Requirements

No external tools required. Works entirely within VS Code using the local file system. No cloud connection, no sign-in.

## Data Storage

Observations are stored locally in `.github/episodic/peripheral/file-observations.json`. No data leaves your machine.

## Source

Extracted from [Alex Cognitive Architecture v5.9.8](https://github.com/fabioc-aloha/Alex_Plug_In) Background File Watcher system. Shared engine in `shared/utils/fileObservations.ts`.

## License

MIT
