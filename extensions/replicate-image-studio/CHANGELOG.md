# Changelog — Replicate Image Studio

## [0.2.0] — 2026-08-24

### Added
- Persistent local history for the latest 50 image and video generations
- Optional negative prompt input for image generation

### Changed
- Modernized README language around durable local creative workflows

## [0.1.3] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.2] — 2026-03-01

### Fixed
- **Activation events** — added missing `onCommand` entries for `generateSmart`, `generateBanner`, and `saveToFile` so all commands reliably activate the extension

## [0.1.1] — 2026-02-27

### Changed
- Display name updated to **CX Replicate Image Studio** for consistent CX brand identity

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Replicate: Generate Image` — open the generation panel and produce AI images from a prompt
- `Replicate: View Generation History` — browse generated images from the current session
- Model selection for supported Replicate models
- `Replicate: Insert Last Image as Markdown` — embed the latest generated image in the active editor
- API key storage through VS Code SecretStorage
- Real-time progress indicator while predictions run
