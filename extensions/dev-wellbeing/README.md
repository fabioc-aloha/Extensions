# Dev Wellbeing

![Dev Wellbeing Banner](assets/banner.png)

**Healthy coding habits — posture reminders, eye breaks, hydration nudges, and session stats**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Runs quietly in the background. Fires gentle reminders at configurable intervals. Tracks session duration and keystrokes.

## Features

- **Posture reminders** — gentle nudges to sit up and unclench shoulders
- **20-20-20 eye breaks** — look 20ft away for 20 seconds every 20 minutes
- **Hydration nudges** — water reminders at a configurable interval
- **Session stats** — coding duration and keystroke count in the status bar
- **Auto-start** — activates on VS Code launch when devWellbeing.enabled is true

## Requirements

No external tools required. Works entirely within VS Code using native notifications.

## Reminders

| Type | Default | Description |
|---|---|---|
| Posture | Every 45m | Sit up, unclench shoulders |
| 20-20-20 eye break | Every 20m | Look 20ft away for 20s |
| Hydration | Every 60m | Have some water |

## Commands

| Command | Description |
|---|---|
| `Dev Wellbeing: Start Monitoring` | Start all reminder timers |
| `Dev Wellbeing: Stop Monitoring` | Stop all reminders |
| `Dev Wellbeing: Show Session Stats` | Duration + keystroke count |
| `Dev Wellbeing: Configure Thresholds` | Open settings |

Auto-starts on VS Code launch if `devWellbeing.enabled` is `true`.

## License

MIT
