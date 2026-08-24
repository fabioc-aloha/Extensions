# v0.2 VSIX Test Guide

## Build and Install

Package a single extension from the repository root:

```powershell
npm run package:all -- --filter=hook-studio
code --install-extension extensions\hook-studio\hook-studio-0.2.0.vsix --force
```

Reload VS Code after installation. Do not publish during smoke testing.

## Portfolio Smoke Matrix

| Extension | Primary v0.2 smoke test |
|---|---|
| AI Voice Reader | Select a system voice, read a long Markdown document, stop playback |
| Brandfetch Logo Fetcher | Store a provider key, fetch a domain logo, insert the selected format |
| Dev Wellbeing | Start monitoring, reload VS Code, confirm local session details persist, then reset |
| Focus Timer | Complete a short configured focus session, add a note, reload, inspect history |
| Gamma Slide Assistant | Export a path containing spaces through Marp; test missing-key Gamma guidance without sending content |
| Hook Studio | Validate `.github/hooks/*.json`, create a recipe, run a static event dry run, migrate a legacy file |
| Knowledge Decay Tracker | Add a per-file decay tag, scan, mark fresh, confirm status/report update |
| Markdown to Word | Check Pandoc, convert one file, batch-convert a folder, open native Markdown preview |
| MCP App Starter | Scaffold each language, insert tool/resource starters, validate and register `.vscode/mcp.json` |
| Mermaid Diagram Pro | Validate Markdown and `.mmd`, run GitHub compatibility check, preview an untrusted-label diagram |
| PPTX Builder | Select each theme, export a long section, verify continuation slides and speaker notes |
| Replicate Image Studio | Cancel a generation, complete one generation, reload, inspect persistent history |
| SecretGuard | Detect a test fixture, add an ignore glob, rescan, verify Problems and redacted output |
| SVG to PNG | Convert one SVG, export icon set, batch to an output directory, inspect WASM in VSIX |
| SVG Toolkit | Open live preview, edit SVG, extract a color, validate the file |
| Workspace Watchdog | Create Git changes and TODOs, scan, inspect populated Explorer groups, clear observations |

## Security and Privacy Checks

- API keys remain in VS Code SecretStorage and never appear in workspace files,
  output logs, or packaged VSIX content.
- Gamma displays a paid-credit confirmation before sending Markdown-derived
  text.
- SecretGuard output identifies location and pattern without printing matched
  credential values.
- Dev Wellbeing, Focus Timer, Knowledge Decay, and Watchdog storage remains
  local and exposes a reset path where persistent state exists.
- Hook recipes and migrations never overwrite an existing current-layout file.

## Package Inspection

For each VSIX:

```powershell
tar -tf path\to\extension-0.2.0.vsix
```

Confirm:

- `extension/out/extension.js` exists.
- `src/`, `.env`, TypeScript sources, and source maps are absent.
- The declared icon, banner, README, CHANGELOG, and license are included.
- SVG to PNG contains
  `extension/out/node_modules/@resvg/resvg-wasm/index_bg.wasm`.

## Release Gate

After targeted smoke testing:

```powershell
npm run package:all
npm run publish:all -- --dry-run --filter=<explicit,comma-separated-set>
```

Publishing requires a separate owner decision and `VSCE_PAT`.
