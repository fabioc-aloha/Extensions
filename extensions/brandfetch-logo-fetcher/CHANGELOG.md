# Changelog — Brandfetch Logo Fetcher

## [0.1.6] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.5] — 2026-02-27

### Changed
- Improved Marketplace description and keywords for better discoverability

## [0.1.4] — 2026-02-27

### Changed
- Display name updated to **CX Brandfetch Logo Fetcher** for consistent CX brand identity

## [0.1.3] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

## [0.1.2] — 2026-02-24

### Added
- Right-click context menu in any open editor: **Fetch Logo by Domain**, **Insert Logo at Cursor**
- All commands now activate the extension on invocation (expanded `activationEvents`)

## [0.1.1] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Brandfetch: Fetch Logo by Domain` — fetch logo and copy to clipboard
- `Brandfetch: Insert Logo at Cursor` — insert Markdown image at cursor position
- `Brandfetch: Set API Key` — secure key storage via VS Code SecretStorage
- `Brandfetch: Clear Logo Cache` — clear in-memory LRU cache
- Logo.dev fallback when Brandfetch API returns no result
- Output formats: Markdown image, SVG URL, PNG URL, HTML `<img>`
- LRU in-memory cache to avoid redundant API calls
