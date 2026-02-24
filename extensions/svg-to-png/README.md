# SVG to PNG

Convert SVG files to pixel-perfect PNGs using [resvg-js](https://github.com/yisibl/resvg-js) — a Rust-based renderer that produces accurate, anti-aliased output with system font support.

## Features

- **Right-click any SVG** → "SVG to PNG: Convert SVG File"
- **Custom width** → scale to any pixel width while maintaining aspect ratio
- **Batch convert** → convert every SVG in the workspace in one command
- **Accurate rendering** — Rust/resvg engine vs. ImageMagick's lossy SVG interpreter
- **System fonts** — text in SVGs renders correctly using installed fonts
- **Auto-open** — generated PNG opens immediately in VS Code preview

## Usage

### Single File
Right-click any `.svg` file in the Explorer or editor → **SVG to PNG: Convert SVG File**

### Custom Width
Right-click → **SVG to PNG: Convert SVG at Custom Width** → enter pixel width

### Batch
Command Palette → **SVG to PNG: Convert All SVGs in Workspace**

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `svgToPng.defaultWidth` | `0` | Output width in px (0 = natural SVG size) |
| `svgToPng.loadSystemFonts` | `true` | Load system fonts for text rendering |
| `svgToPng.openAfterConvert` | `true` | Open PNG in preview after conversion |

## Why resvg?

ImageMagick's SVG parser is incomplete and often mangles gradients, paths, and text at small scales. resvg-js uses a Rust implementation of the full SVG spec — the same engine used in browser-quality rendering pipelines.

---

*Part of the [CorreaX Extensions](https://github.com/fabioc-aloha/Extensions) monorepo.*
