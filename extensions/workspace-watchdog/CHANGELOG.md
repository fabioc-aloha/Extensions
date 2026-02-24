# Changelog — CX Workspace Watchdog

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
