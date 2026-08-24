# Changelog — SVG to PNG

## [0.2.0] — 2026-08-23

### Added
- `SVG to PNG: Export Transparent Icon Set` — exports 16-512 px PNG assets from one SVG
- `svgToPng.outputDirectory` — directs output to an absolute or workspace-relative directory while preserving batch subfolders
- SVG language activation for a more reliable editor workflow

### Changed
- Batch conversion and icon-set export are cancellable
- Modernized README language around production asset workflows

## [0.1.2] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.1] — 2026-02-27

### Changed
- Improved description and keywords (batch convert, rust renderer, image conversion)

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `SVG to PNG: Convert Active File` — convert the focused `.svg` to a PNG at native dimensions
- `SVG to PNG: Convert with Custom Size` — prompt for target width; height scales proportionally
- Rust-powered rendering via `@resvg/resvg-js` for pixel-perfect output
- Configurable default width
- Progress notification with open-file link on completion
- Async file I/O (`fs.promises.readFile` / `fs.promises.writeFile`) — non-blocking conversion pipeline
