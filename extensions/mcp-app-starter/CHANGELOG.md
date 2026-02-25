# Changelog — MCP App Starter

## [0.1.7] — 2026-02-25

### Changed
- Refactored all synchronous file system operations to async (`fs.promises.mkdir`, `fs.promises.writeFile`, `fs.promises.access`) — eliminates blocking I/O in scaffold pipeline

## [0.1.6] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

## [0.1.5] — 2026-02-24

### Added
- Right-click a folder in Explorer: **New MCP Server** scaffolds directly into that folder
- Right-click `.ts`, `.js`, `.py` files: **Add Tool**, **Add Resource** in both Explorer and editor context menus
- Right-click `.json` files: **Validate MCP Server Config** in context menu
- All commands now activate the extension on invocation (expanded `activationEvents`)

## [0.1.4] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

### Added
- Initial release
- Guided wizard: language picker → server name → scaffold
- TypeScript template with full tool schema boilerplate
- JavaScript (ESM) template
- Python template using official `mcp` package
- Auto-generated `mcp.json` VS Code config
- Add Tool command stub
- Add Resource command stub
- Validate Config command (JSON lint on all mcp.json files)
- Open MCP Documentation command

### Fixed
- Banner image uses absolute GitHub raw URL for Marketplace visibility
