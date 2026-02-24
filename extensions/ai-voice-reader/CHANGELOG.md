# Changelog — AI Voice Reader

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
