# Changelog — Brandfetch Logo Fetcher

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
