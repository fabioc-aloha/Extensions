# Changelog — Hook Studio

## [0.2.0] — 2026-08-23

### Added
- `Hook Studio: Validate Workspace Hooks` for static JSON, lifecycle event, action type, and command validation
- Discovery and file watching for `.github/hooks/*.json` alongside the legacy `.github/hooks.json` path
- Legacy migration that creates a reviewable current-layout file without changing the original
- Additive formatting, test, and audit recipe starters under `.github/hooks/`

### Changed
- Updated documentation to distinguish static validation from unavailable hook execution telemetry
- Modernized metadata for current VS Code Copilot hook configurations

## [0.1.9] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.8] — 2026-02-27

### Changed
- Improved Marketplace description and keywords for better discoverability (Copilot agent hooks, hooks.json, workflow automation)

## [0.1.7] — 2026-02-27

### Changed
- Display name updated to **CX Hook Studio** for consistent CX brand identity

## [0.1.6] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

All notable changes to this extension will be documented here.

## [0.1.5] — 2026-02-24

### Added
- Right-click `hooks.json` in Explorer: **Open GUI**, **Test Hook Condition**, **Export hooks.json**, **Open Execution Log**
- Right-click `hooks.json` in editor: same four commands in context menu
- All hook commands now activate the extension on invocation (expanded `activationEvents`)

## [0.1.4] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

## [0.1.3] — 2026-02-24

### Added
- Initial release
- Rule Builder tab with `hooks.json` editor and JSON validator
- Execution Log tree view in Explorer sidebar
- Condition Tester for simulating tool calls
- Import from Alex command
- Export hooks.json command
- File system watcher for live reload on external edits

### Fixed
- Banner image uses absolute GitHub raw URL for Marketplace visibility
