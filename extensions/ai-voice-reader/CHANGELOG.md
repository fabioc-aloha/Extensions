# Changelog — AI Voice Reader

## [0.1.7] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.6] — 2026-03-01

### Improved
- **`Set Voice` command** — now opens a Quick Pick menu with direct shortcuts to VS Code settings (`voiceReader.*`) and Azure Cognitive Speech setup guidance, instead of showing a static info message

## [0.1.5] — 2026-02-27

### Changed
- Display name updated to **CX AI Voice Reader** for consistent CX brand identity

## [0.1.4] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

## [0.1.3] — 2026-02-25

### Fixed
- Corrected extension description — removed inaccurate Azure Cognitive Speech reference

### Changed
- Added `Education` category for better Marketplace discoverability

## [0.1.2] — 2026-02-24

### Added
- Right-click context menu on any editor file: **Read Selection**, **Read Entire Document**, **Stop**
- Right-click context menu in Explorer: **Read File...** on any file
- All commands now activate the extension on invocation (expanded `activationEvents`)

## [0.1.1] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Voice Reader: Read Selection` — read selected text or current line
- `Voice Reader: Read Entire Document` — narrate the active file
- `Voice Reader: Read File...` — pick any text file to read
- `Voice Reader: Stop` — stop playback immediately
- Cross-platform TTS: PowerShell on Windows, `say` on macOS, `espeak` on Linux
- Markdown stripping before speech (headings, bold, backticks, code fences)
- Configurable playback rate (`voiceReader.rate`)
