# Workspace Watchdog

![Workspace Watchdog Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/workspace-watchdog/assets/banner.png)

**Background file health monitor — surface stalled work, uncommitted patterns, and TODO hotspots**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)
[![Publisher](https://img.shields.io/badge/publisher-fabioc--aloha-orange)](https://marketplace.visualstudio.com/publishers/fabioc-aloha)
[![Version](https://img.shields.io/visual-studio-marketplace/v/fabioc-aloha.cx-workspace-watchdog)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog)

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
| **Right-click menus** | Right-click any folder in Explorer → **Show Dashboard** or **Scan Now** without opening the Palette |

## Stall Severity Tiers

| Tier | Threshold | Action |
|---|---|---|
| Warning | >1 day | Listed in dashboard |
| Alert | >3 days | Visible in sidebar |
| Critical | >7 days | Toast notification |

## Commands

| Command | Where | Description |
|---|---|---|
| `Workspace Watchdog: Show Dashboard` | Palette · Right-click folder | Open health dashboard in output panel |
| `Workspace Watchdog: Scan Now` | Palette · Right-click folder | Force immediate scan |
| `Workspace Watchdog: Hot Files` | Palette | QuickPick of most-opened files |
| `Workspace Watchdog: Stalled Files` | Palette | QuickPick of stalled files |
| `Workspace Watchdog: Clear History` | Palette | Reset all tracking data |

## Requirements

No external tools required. Works entirely within VS Code using the local file system. No cloud connection, no sign-in.

## Data Storage

Observations are stored locally in `.github/episodic/peripheral/file-observations.json`. No data leaves your machine.

## License

MIT
