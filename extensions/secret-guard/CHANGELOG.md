# Changelog — Secret Guard

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
