# Changelog — Focus Timer

## [0.2.0] — 2026-08-24

### Added
- Persisted completed focus and break sessions, the completed-focus count, and optional session notes in VS Code extension global storage.
- Added `Focus Timer: Add Note to Latest Focus Session`.

### Changed
- `Focus Timer: Reset Local Session History` now clearly removes the local history and counter after confirmation.
- Limited retained local history to the 200 most recent completed sessions.

## [0.1.4] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.3] — 2026-02-28

### Fixed
- **Keyboard shortcuts now work** — `Ctrl+Shift+F` (start) and `Ctrl+Shift+P` (pause) were silently inactive because the `focusTimer.running` context key was never set via `setContext`. All state transitions (start, stop, session complete) now correctly call `vscode.commands.executeCommand('setContext', 'focusTimer.running', true/false)` so `when` clauses activate as expected.

## [0.1.2] — 2026-02-27

### Added
- **Keyboard shortcuts** — `Ctrl+Shift+F` / `Cmd+Shift+F` to start a focus session; `Ctrl+Shift+P` / `Cmd+Shift+P` to pause/resume
- **Session count badge** in status bar — shows `🍅×3` after completing sessions so you always know your progress
- `Focus Timer: Reset Session Count` command to start fresh

### Changed
- Status bar label shortened to `Focus` when idle to reduce clutter; badge shows count

## [0.1.1] — 2026-02-25

### Fixed
- **Break duration in session history** — history entries for breaks now record the actual break duration (short or long) instead of always using the short break duration
- Output channel log now shows the correct break length when a break session starts

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Focus Timer: Start Focus Session` — start a Pomodoro work sprint in the status bar
- `Focus Timer: Stop` — stop the active timer
- `Focus Timer: Pause / Resume` — pause or resume mid-sprint
- `Focus Timer: Start Break` — start a short or long break
- `Focus Timer: Show Session History` — view completed sessions log
- Status bar countdown display with click-to-pause
- Auto long break after 4 completed work sessions
- Configurable work, short break, and long break durations
