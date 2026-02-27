# Changelog — SVG to PNG

## [0.1.1] — 2026-02-27

### Changed
- Improved description and keywords (batch convert, rust renderer, image conversion)

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `SVG to PNG: Convert Active File` — convert the focused `.svg` to a PNG at native dimensions
- `SVG to PNG: Convert with Custom Size` — prompt for target width; height scales proportionally
- `SVG to PNG: Convert Folder` — batch-convert all SVGs in a selected directory
- `SVG to PNG: Watch SVG` — auto-reconvert whenever the source SVG is saved
- Rust-powered rendering via `@resvg/resvg-js` for pixel-perfect output
- Configurable default width and output path in extension settings
- Progress notification with open-file link on completion
- Async file I/O (`fs.promises.readFile` / `fs.promises.writeFile`) — non-blocking conversion pipeline
