# Dev Wellbeing

**Healthy coding habits — posture reminders, eye breaks, hydration nudges, and session stats**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Runs quietly in the background. Fires gentle reminders at configurable intervals. Tracks session duration and keystrokes.

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
