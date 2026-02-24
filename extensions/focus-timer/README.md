# Focus Timer

![Focus Timer Banner](https://raw.githubusercontent.com/fabioc-aloha/Extensions/main/extensions/focus-timer/assets/banner.png)

**Pomodoro timer in the status bar — work sprints, break reminders, session history**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

25-minute work sessions. 5-minute breaks. Long break every 4 sessions. All in the status bar, all via commands. No web UI, no sign-in, no distractions.

## Features

- **Pomodoro timer in the status bar** — always visible, never intrusive
- **Customizable cadence** — configure work, short break, and long break durations
- **Auto long break** — triggers automatically after 4 completed work sessions
- **Session history** — log of all completed sessions for the current VS Code session
- **Pause/resume** — click the status bar item or use the command to pause mid-sprint

## Requirements

No external tools required. Works entirely within VS Code.

## Usage

1. `Focus Timer: Start Focus Session` — starts the countdown in status bar
2. Click the status bar item to pause/resume
3. `Focus Timer: Start Break` — short (5m) or long break (15m after 4 sessions)
4. `Focus Timer: Show Session History` — log of all completed sessions

## Settings

| Setting | Default | Description |
|---|---|---|
| `focusTimer.workMinutes` | 25 | Work session length |
| `focusTimer.shortBreakMinutes` | 5 | Short break length |
| `focusTimer.longBreakMinutes` | 15 | Long break length |

## License

MIT
