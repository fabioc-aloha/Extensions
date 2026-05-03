# Changelog — CX Workspace Watchdog

## [0.1.9] — 2026-02-28

### Changed
- README — absolute banner URL, publisher and version shields added

## [0.1.8] — 2026-03-01

### Fixed
- **`Clear History` now actually clears history** — previously called `store.save()` on unchanged data, leaving all observations intact; now calls `store.clear()` to reset all tracked file data before saving
- Added modal confirmation dialog to prevent accidental data loss

## [0.1.7] — 2026-02-25

### Changed
- Context menu submenu renamed to **🔷 CX Tools** (emoji label) for visual identity
- README: added CX Tools Suite table with Marketplace links to all 16 extensions

## [0.1.6] — 2026-02-25

### Fixed
- `FileObservationStore.save()` now uses async `fs.promises.writeFile` / `fs.promises.mkdir` instead of sync equivalents

### Changed
- Added `Visualization` category for better Marketplace discoverability
## [0.1.5] — 2026-02-24

### Added
- Right-click any folder in Explorer: **Show Dashboard**, **Scan Now** in context menu
- Right-click in any editor: **Show Dashboard**, **Scan Now** in context menu

## [0.1.4] — 2026-02-24

### Changed
- Added `author` field for Marketplace discoverability

### Added
- Initial release (published as `cx-workspace-watchdog` — `workspace-watchdog` name taken on Marketplace)
- Background file health monitoring (30-minute scan interval)
- Hot files tracking via open event listener
- Stalled files detection (warning/alert/critical tiers at 1d/3d/7d)
- TODO hotspot aggregation
- Health dashboard in Output panel
- QuickPick for hot files and stalled files navigation
- Critical stalled files toast notification

### Fixed
- Banner image uses absolute GitHub raw URL for Marketplace visibility
