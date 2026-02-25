# Changelog — Knowledge Decay Tracker

## [0.1.4] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

## [0.1.3] — 2026-02-25

### Fixed
- Replaced synchronous `fs.statSync` calls with async `vscode.workspace.fs.stat()` in scan and critical-file routines
- Replaced `fs.utimesSync` with `fs.promises.utimes` in `touchCurrentFile`

## [0.1.2] — 2026-02-24

### Added
- Right-click any file in editor: **Mark File as Fresh**, **Show Critical Files**, **Scan Workspace**, **Show Staleness Report**
- Right-click any file in Explorer: **Mark File as Fresh**, **Show Staleness Report**

## [0.1.1] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Knowledge Decay: Show Dashboard` — view all tracked topics and their decay status
- `Knowledge Decay: Track New Topic` — register a topic with a review interval
- `Knowledge Decay: Mark as Reviewed` — reset the decay clock for a topic
- `Knowledge Decay: Set Reminder` — schedule a VS Code notification for a topic
- Decay scoring algorithm (exponential decay based on last-review date)
- Status bar indicator showing count of overdue topics
- Topics persisted in workspace storage across sessions
