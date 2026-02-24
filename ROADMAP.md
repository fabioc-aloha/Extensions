# Extensions Roadmap

**Last Updated**: February 24, 2026

---

## Priority Order

Ordered by: shipping window urgency first, effort second, audience size third.

### ✅ Infrastructure — Fully Implemented

All foundation work is done. Every extension has a working `extension.ts` and all shared utilities are complete.

| Component | Status |
|---|:---:|
| `shared/utils/fileObservations.ts` | ✅ Implemented (166 lines) |
| `shared/utils/decay.ts` | ✅ Implemented (128 lines) |
| `shared/utils/secretScanner.ts` | ✅ Implemented |
| `shared/api/replicate.ts` | ✅ Implemented |
| `shared/api/brandfetch.ts` | ✅ Implemented |
| Alex Extensions `.github/` heir | ✅ Deployed (v1.0.0) |
| All 15 extension `extension.ts` files | ✅ Implemented |

**Next step for all sprints**: `npm run compile` → `F5` test in Extension Development Host → `npx vsce package` → publish.

### 🔨 Sprint 1 — First Movers (Implemented — Ship Next)

These three have open first-mover windows tied to VS Code 1.109 (released Feb 4, 2026). No competing extensions exist yet.

| Extension | Effort | Why Now |
|---|:---:|---|
| [Hook Studio](#hook-studio) | 1w | VS Code 1.109 shipped agent hooks with zero tooling. Every Copilot agent user is a potential customer. |
| [Workspace Watchdog](#workspace-watchdog) | 2d | Background File Watcher engine fully built in Alex v5.9.8. Zero AI needed. Broadest audience. |
| [MCP App Starter](#mcp-app-starter) | 3d | MCP Apps went stable in VS Code 1.109. No scaffolding tool exists. Developer tooling for developers. |

### ✅ Sprint 2 — Code Extracted & Implemented (Next: Compile + Package)

Logic exists in Alex. These are extraction + packaging tasks, not net-new builds.

| Extension | Effort | Source in Alex |
|---|:---:|---|
| [SecretGuard](#secret-guard) | 3d | `secretScanner.ts` — enterprise secret scan already built |
| [Focus Timer](#focus-timer) | 2d | Focus/goals system, Pomodoro logic in Alex |
| [Knowledge Decay Tracker](#knowledge-decay-tracker) | 3d | Forgetting Curve decay engine (`v5.9.6`) — exact same math |
| [Markdown to Word](#markdown-to-word) | 3d | `md-to-word` skill — Pandoc pipeline already documented |
| [Brandfetch Logo Fetcher](#brandfetch-logo-fetcher) | 2d | Brandfetch API client already in Alex extension |
| [AI Voice Reader](#ai-voice-reader) | 3d | TTS module built in Alex v5.4.x |

### � Sprint 3 — Moderate Builds (Implemented — Next: Compile + Test)

Require more new code but have strong Alex foundations.

| Extension | Effort | Foundation |
|---|:---:|---|
| [Dev Wellbeing](#dev-wellbeing) | 3d | Siegel Session Health (v5.9.4), Window of Tolerance signals |
| [PPTX Builder](#pptx-builder) | 4d | `pptxgenjs` already in Alex deps |
| [Replicate Image Studio](#replicate-image-studio) | 1w | Replicate MCP wired in Alex; ADR-007 reference impl |

### � Sprint 4 — Larger Builds (Implemented — Next: Compile + Test)

| Extension | Effort | Notes |
|---|:---:|---|
| [Mermaid Diagram Pro](#mermaid-diagram-pro) | 1w | Deep Mermaid patterns in Alex; live preview needs Mermaid.js integration |
| [SVG Toolkit](#svg-toolkit) | 1w | SVG skill exists; image conversion pipeline is the hard part |
| [Gamma Slide Assistant](#gamma-slide-assistant) | 1w | Gamma API not public yet; Marp is the offline path |

---

## Extension Specs

### Hook Studio

**Tagline**: Visual GUI for VS Code agent hooks — build, debug, and test `hooks.json` without reading docs.

**Core features**:
- Drag-and-drop rule builder for PreToolUse / PostToolUse / SessionStart / SessionStop
- Live hook execution log (which hooks fired, when, with what args)
- Hook condition tester — simulate a tool call and preview matching hooks
- Schema validation with inline error messages
- Import/export hooks between projects

**Tech**: VS Code API, JSON Schema validation, Webview (React)
**Status**: � Implemented

---

### Workspace Watchdog

**Tagline**: Ambient project health monitor — know what's hot, what's stalled, where the debt is.

**Core features**:
- Hot file heatmap (files opened ≥5× in 7 days)
- Stalled work alerts (uncommitted git changes by age — 1d warning, 3d alert, 7d critical)
- TODO/FIXME hotspot surfacing with density heatmap
- Test result freshness (last-run age + pass rate from jest/vitest output)
- Status bar widget with color-coded health tier (green/yellow/red)
- Observation history persisted across sessions (`file-observations.json`)

**Tech**: VS Code API, `child_process` (git), file system watchers
**Status**: � Implemented

---

### MCP App Starter

**Tagline**: Scaffold a working MCP App in one command — `>MCP App: New Project`.

**Core features**:
- Project scaffolding wizard: name, tools to register, auth type
- Generates: manifest, webview shell, tool registration boilerplate, test harness
- Preview mode: renders the MCP App inside VS Code Webview before publishing
- Built-in examples: echo tool, file reader, status reporter
- Validates manifest against MCP Apps schema on save

**Tech**: VS Code API, MCP Apps SDK (`modelcontextprotocol/ext-apps`), Webview
**Status**: � Implemented

---

### SecretGuard

**Tagline**: Workspace-wide secret scanner with severity tiers and audit export.

**Core features**:
- Scans entire workspace on demand or on file save
- 50+ regex patterns: API keys, tokens, passwords, connection strings, private keys
- Severity tiers: Critical (private keys), High (API tokens), Medium (passwords), Low (URLs with credentials)
- Audit log export: JSON + CSV, CI/CD ready
- `.secretguardignore` file support
- Git pre-commit hook integration

**Tech**: Regex engine, VS Code Diagnostics API, file system
**Status**: � Implemented

---

### Focus Timer

**Tagline**: Pomodoro + goals tracker embedded in the status bar.

**Core features**:
- Pomodoro timer with customizable work/break intervals
- Session goals: set 1–3 goals per session, check off when done
- Streak tracking: daily and weekly coding streaks
- Session notes: quick capture at session end
- GitHub Issues sync: goals can link to open issues
- Zero AI dependency

**Tech**: VS Code API, status bar, SecretStorage (settings)
**Status**: � Implemented

---

### Knowledge Decay Tracker

**Tagline**: Tag any document with a review schedule — get warned when it goes stale.

**Core features**:
- Frontmatter or comment tag: `<!-- review: 90d -->` or `review: 2026-05-15`
- Decay profiles: aggressive (14d), moderate (60d), slow (180d), permanent
- Status bar badge: count of overdue documents
- Batch review report: grouped by overdue tier, owner, last-modified date
- GitHub Issues integration: auto-create review tasks for overdue docs
- Works on `.md`, `.ts`, `.json`, ADR files — any text file

**Tech**: VS Code API, frontmatter parser, file system
**Status**: � Implemented

---

### Markdown to Word

**Tagline**: Convert any `.md` file to `.docx` with one click.

**Core features**:
- Right-click `.md` → "Export to Word"
- Mermaid diagrams rendered as images inline
- Tables, code blocks, headings all properly styled
- Custom `.docx` template support
- GitHub-flavored Markdown including task lists
- Batch export: convert entire folder of `.md` files

**Tech**: Pandoc (shell), `docx` npm package fallback, Mermaid CLI
**Status**: � Implemented

---

### Brandfetch Logo Fetcher

**Tagline**: Fetch company logos by domain, insert into markdown or code comments.

**Core features**:
- `>Insert Logo: Company Name` command palette entry
- Searches by company name or domain (Logo.dev + Brandfetch fallback)
- Insert as: inline image markdown, SVG, PNG reference, base64 data URI
- Recent logos cache (avoid redundant API calls)
- Bulk insert from list (paste 10 company names, get 10 logos)

**Tech**: Brandfetch API, Logo.dev API, VS Code TextEditor
**Status**: � Implemented

---

### AI Voice Reader

**Tagline**: Read any editor content or chat response aloud with per-language voice routing.

**Core features**:
- Read selection, read file, read from cursor to end
- System TTS (Web Speech API) with no API key required
- Optional: cloud voices via Azure Speech or ElevenLabs (API key)
- Per-language voice routing: code files → slower, methodical; prose → natural pace
- Speed control: 0.5× to 2× with keyboard shortcut
- Auto-scroll to follow reading position

**Tech**: VS Code API, Web Speech API (Webview), Azure Speech SDK (optional)
**Status**: � Implemented

---

### Dev Wellbeing

**Tagline**: Unobtrusive session health companion — know when to take a break before you need one.

**Core features**:
- Session length tracker with configurable break reminders
- Frustration signal detection: rapid undo bursts, compile-fail streaks, cursor thrashing
- Window of Tolerance indicator: green (flow) / yellow (exiting flow) / red (overloaded)
- Micro-break suggestions when stress signals accumulate (non-blocking toast)
- Pomodoro integration with Focus Timer
- All local, zero telemetry

**Tech**: VS Code API, text change events, status bar
**Status**: � Implemented

---

### PPTX Builder

**Tagline**: Create PowerPoint decks from markdown outlines — slide per heading.

**Core features**:
- Convert `# Heading` → slide title, `- bullets` → slide content
- Branded themes: choose from presets or load `.pptx` template
- Code blocks → syntax-highlighted code slides
- Chart generation from fenced code blocks (e.g., `\`\`\`chart`)
- Speaker notes from `> blockquote` syntax
- Export to Google Slides via PPTX import

**Tech**: `pptxgenjs`, VS Code API, file system
**Status**: � Implemented

---

### Replicate Image Studio

**Tagline**: Generate images from selection or prompt directly in VS Code chat.

**Core features**:
- Generate image from selected text prompt
- Model chooser: FLUX, SDXL, Stability AI, video (Wan 2.1)
- Right-click markdown image reference → "Regenerate with AI"
- Image upscaling: super-resolution via Replicate
- Result inserted as markdown image or saved to `assets/`
- Chat participant: `@replicate generate a banner for my README`

**Tech**: Replicate API, VS Code Chat Participant API, file system
**Status**: � Implemented

---

### Mermaid Diagram Pro

**Tagline**: Enhanced Mermaid editing — live preview, AI fix, one-click export.

**Core features**:
- Live preview panel: renders as you type, instant feedback
- Parse error highlighting with AI-fix suggestions
- Export to PNG / SVG / PDF
- Diagram templates: flowchart, sequence, class, ER, gantt starters
- Diff mode: before/after comparison for diagram edits
- GitHub Mermaid compatibility checker

**Tech**: Mermaid.js (WASM), VS Code CustomEditor, Webview, Sharp (export)
**Status**: � Implemented

---

### SVG Toolkit

**Tagline**: Generate, edit, and optimize SVGs with AI assistance.

**Core features**:
- PNG/JPG → SVG vectorization (Sharp + potrace)
- AI icon generation: describe an icon, get an SVG
- VS Code theme-aware color token swap (replace hardcoded colors with `var(--vscode-*)`)
- SVGO optimization with configurable presets
- Batch process: optimize entire `assets/` folder
- SVG preview panel with zoom and path inspection

**Tech**: Sharp, SVGO, potrace (WASM), VS Code API, Replicate (AI generation)
**Status**: � Implemented

---

### Gamma Slide Assistant

**Tagline**: Transform markdown outlines into presentation-ready slides.

**Core features**:
- **Offline path (available now)**: Convert markdown → branded Marp `.md` with slide themes, speaker notes, and image placeholders
- **Online path (when Gamma API opens)**: One-command upload to Gamma.app with AI-enhanced titles and layouts
- Slide theme library: minimal, corporate, dark, academic
- Image placeholder AI: describe a slide visual, generate it via Replicate
- Export: Marp → HTML, PDF, PPTX

**Tech**: Marp CLI, Gamma API (when available), Replicate API, VS Code API
**Status**: � Implemented

---

## 💡 Extension Ideas Backlog

*Origin: Spun off from Alex Cognitive Architecture v5.9.8 — each extension extracts a pattern or skill already proven in Alex. Moved here 2026-02-24 as the authoritative home.*

| Extension | Category | Core Feature | Tech | Effort | Origin |
| --- | :---: | --- | :---: | :---: | --- |
| **Replicate Image Studio** | 🎨 Image Gen | Generate images from selection or prompt — FLUX, Stability, SDXL, video. Right-click any markdown image reference to regenerate. | Replicate API | 1w | Replicate MCP wired in Alex; ADR-007 reference impl |
| **Markdown to Word** | 📄 Converter | Convert any `.md` file to `.docx` with one click — tables, code blocks, mermaid diagrams, theme support. | Pandoc / docx | 3d | `md-to-word` skill — Pandoc pipeline already documented |
| **SVG Toolkit** | 🖼️ Image Gen | Generate, edit, and optimize SVGs with AI assist. Convert PNG/JPG → SVG, icon generation, VS Code theme-aware color swaps. | Sharp, AI | 1w | SVG skill exists in Alex; standalone widens audience massively |
| **PPTX Builder** | 📊 Converter | Create PowerPoint decks from markdown outlines. Slide-per-heading conversion, branded themes, chart generation from code blocks. | pptxgenjs | 4d | `pptxgenjs` already in Alex deps — extract and expose cleanly |
| **Brandfetch Logo Fetcher** | 🏢 Utility | Fetch company logos by ticker/domain, insert into markdown or code comments. Logo.dev + Brandfetch fallback. | REST APIs | 2d | Brandfetch API client already in Alex extension |
| **Gamma Slide Assistant** | 🎤 Presenter | Generate Marp `.md` with branded themes as offline path. When Gamma API opens: one-command upload with AI-enhanced titles and speaker notes. | Gamma / Marp | 1w | Gamma skill exists; Marp is Alex's fallback path |
| **Mermaid Diagram Pro** | 📐 Diagramming | Enhanced Mermaid editing — live preview, error highlighting, AI-fix on parse error, export to PNG/SVG/PDF. | Mermaid.js | 1w | Deep Mermaid patterns in Alex |
| **SecretGuard** | 🔒 Security | Workspace-wide secret scanner with regex patterns, severity tiers, audit log export. CI/CD-ready JSON report output. | Regex engine | 3d | `secretScanner.ts` — enterprise secret scan already built |
| **AI Voice Reader** | 🔊 Accessibility | Read any editor content or chat response aloud using system TTS or cloud voices. Per-language voice routing, speed control. | Web Speech API | 3d | TTS module built in Alex v5.4.x |
| **Focus Timer** | ⏱️ Productivity | Pomodoro + goals tracker embedded in status bar. Session notes, streak tracking, GitHub Issues sync. Zero AI dependency. | VS Code API | 2d | Focus/goals system already in Alex — extract and simplify |
| **Workspace Watchdog** ⭐ | 👁️ Awareness | Ambient project health monitor: hot file heatmap, stalled-work alerts, TODO/FIXME hotspot surfacing, test-result freshness. Zero AI required. | VS Code API | 2d | Background File Watcher (v5.9.8) is the engine |
| **Hook Studio** ⭐ | 🪝 Dev Tools | Visual GUI for `hooks.json` — drag-and-drop rule builder, live execution log, hook condition tester. | VS Code API | 1w | First mover — agent hooks shipped in VS Code 1.109 with no tooling |
| **Knowledge Decay Tracker** ⭐ | 📅 Knowledge | Tag markdown files with review schedules, get status bar warnings when knowledge goes stale. Batch review report. | VS Code API + frontmatter | 3d | Forgetting Curve (v5.9.6) — exact same decay math applied to workspace docs |
| **MCP App Starter** ⭐ | 🛠️ Dev Tools | Scaffold a working MCP server in one command. Generates manifest, tool registration boilerplate, test harness. | MCP Apps SDK | 3d | MCP Apps stable in VS Code 1.109; no scaffolding tool exists |
| **Dev Wellbeing** ⭐ | 🧘 Wellness | Tracks session length, detects frustration signals, suggests micro-breaks. All local, zero telemetry. | VS Code API | 3d | Siegel session health patterns (v5.9.4); Peripheral Vision ambient layer |

**Prioritization notes (updated 2026-02-24):**
- 🔥 Highest value: Replicate Image Studio, Markdown to Word, SVG Toolkit, SecretGuard — large existing audiences
- ⚡ Fastest to ship: Brandfetch Logo Fetcher, AI Voice Reader, Focus Timer, Knowledge Decay Tracker — code already written, just packaging
- 🆕 Best first-mover: **Hook Studio**, **Workspace Watchdog**, **MCP App Starter** — VS Code 1.109 timing, no competition
- 🔗 Alex synergy: Keep API keys, settings, and UX patterns consistent to allow future re-integration

---

## Version Strategy

Each extension versions independently following semantic versioning.
- All extensions start at `v0.1.0` (preview)
- Graduate to `v1.0.0` when: no known bugs, smoke tested, CHANGELOG complete
- Publish to Marketplace under `fabioc-aloha` publisher

## Timeline

| Period | Goal |
|---|---|
| Feb–Mar 2026 | Sprint 1: Hook Studio, Workspace Watchdog, MCP App Starter |
| Mar–Apr 2026 | Sprint 2: SecretGuard, Focus Timer, Knowledge Decay Tracker, Markdown to Word |
| Apr–Jun 2026 | Sprint 3: Dev Wellbeing, PPTX Builder, Replicate Image Studio |
| Jun+ 2026 | Sprint 4: Mermaid Diagram Pro, SVG Toolkit, Gamma Slide Assistant |
