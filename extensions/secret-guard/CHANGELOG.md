# Changelog — CX SecretGuard

## [0.2.0] — 2026-08-24

### Added
- Workspace-relative `secretGuard.ignorePatterns` now consistently excludes files from on-type, on-save, current-file, and workspace scans.
- Added a command to add an ignore pattern to VS Code workspace settings.

### Fixed
- Reduced the Azure credential pattern's broad false positives by requiring an Azure credential assignment.
- Cleared stale diagnostics when a subsequent scan finds no match.
- Corrected source and documentation claims to the implemented 13 patterns; SecretGuard has no `.secretguardignore` file or pre-commit integration.

## [0.1.6] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.5] — 2026-02-27

### Added
- **Real-time scanning as-you-type** — secrets are detected 600ms after you stop typing (configurable with `secretGuard.scanOnType`)
- **Status bar badge** — shows `⚠️ N secrets` in the status bar when secrets are detected in the current file; turns red to alert you immediately
- **`SecretGuard: Clear Findings for Current File`** command to clear current diagnostics until the next scan
- Active file scanned on extension activation

## [0.1.4] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

## [0.1.3] — 2026-02-25

### Changed
- Added `Linters` category for better Marketplace discoverability
## [0.1.2] — 2026-02-24

### Added
- Right-click any file in editor: **Scan Current File**, **Add Ignore Pattern**, **View Audit Report**
- Right-click any file in Explorer: **Scan Current File**, **Add Ignore Pattern**; right-click Explorer root: **Scan Workspace**

## [0.1.1] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Secret Guard: Scan Workspace` — detect hardcoded secrets across all files in the workspace
- `Secret Guard: Scan Active File` — quick single-file secrets check
- `Secret Guard: Show Report` — open a detailed findings panel with severity and location
- `Secret Guard: Add Allowlist Entry` — suppress a specific false-positive finding
- 13 secret patterns: API keys, tokens, passwords, connection strings, private keys
- Inline diagnostic warnings on detected secrets in the editor
