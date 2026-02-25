# Changelog — CX SecretGuard

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
- 40+ secret patterns: API keys, tokens, passwords, connection strings, private keys
- Inline diagnostic warnings on detected secrets in the editor
- `.secretguardignore` support for excluding files and folders
- Pre-commit guard mode (warn before saving files with detected secrets)
