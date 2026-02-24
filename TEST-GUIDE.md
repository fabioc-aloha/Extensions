# Test Guide — Extensions Monorepo

**Testing Method**: Local VSIX installation (not F5/Extension Development Host)

---

## General Testing Workflow

For every extension:

```bash
# 1. Navigate to extension folder
cd extensions/<extension-name>

# 2. Compile
npm run compile

# 3. Package
npx vsce package

# 4. Verify no secrets bundled
npx vsce ls

# 5. Install locally
code --install-extension <extension-name>-*.vsix

# 6. Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")

# 7. Test commands and features (see below)

# 8. Uninstall when done testing
code --uninstall-extension fabioc-aloha.<extension-name>
```

---

## Sprint 1 — First Movers (Priority)

### Hook Studio

**Install**: `code --install-extension hook-studio-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Hook Studio: Open GUI` | Ctrl+Shift+P → type command | Webview panel opens with 3 tabs |
| `Hook Studio: Test Hook Condition` | Open GUI, add a hook, click Test | Condition evaluates, shows pass/fail |
| `Hook Studio: Import hooks.json from Alex` | Ctrl+Shift+P → type command | File picker opens, imports hooks |
| `Hook Studio: Export hooks.json` | After adding hooks, run command | Saves `.github/hooks.json` to workspace |

**Activation test**: Open any folder containing `.github/hooks.json` — extension should activate automatically.

**Webview tabs to verify**:
- [ ] Editor tab — drag-and-drop rule builder renders
- [ ] Runner tab — hook execution controls appear
- [ ] Log tab — execution history displays

---

### Workspace Watchdog

**Install**: `code --install-extension workspace-watchdog-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Workspace Watchdog: Show Dashboard` | Ctrl+Shift+P → type command | Dashboard panel opens |
| `Workspace Watchdog: Scan Now` | Run command in any workspace | Progress notification, then results |
| `Workspace Watchdog: Hot Files` | Open 5+ files in a session, run command | Shows frequently accessed files |
| `Workspace Watchdog: Stalled Files` | Have uncommitted git changes, run command | Shows files by staleness tier |
| `Workspace Watchdog: Clear History` | Run command | Clears observation history |

**Activation test**: Extension activates on startup — check status bar for health indicator.

**Features to verify**:
- [ ] Status bar widget appears (green/yellow/red health tier)
- [ ] File Health view appears in Explorer sidebar
- [ ] Hot files heatmap shows recently opened files
- [ ] Stalled work alerts fire for uncommitted changes (1d warning, 3d alert, 7d critical)

---

### MCP App Starter

**Install**: `code --install-extension mcp-app-starter-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `MCP App Starter: New MCP Server` | Ctrl+Shift+P → type command | Wizard prompts for name, language (TS/JS/Python), tools |
| `MCP App Starter: Add Tool to MCP Server` | Run in folder with MCP server | Prompts for tool name, adds boilerplate |
| `MCP App Starter: Add Resource to MCP Server` | Run in folder with MCP server | Prompts for resource name, adds boilerplate |
| `MCP App Starter: Validate MCP Server Config` | Run in MCP server folder | Validates manifest against schema |
| `MCP App Starter: Open MCP Documentation` | Run command | Opens MCP docs in browser |

**Wizard flow to verify**:
1. [ ] Name prompt appears
2. [ ] Language picker (TypeScript / JavaScript / Python)
3. [ ] Tool registration options
4. [ ] Auth type selection
5. [ ] Files generated in workspace

---

## Sprint 2 — Code Extracted

### SecretGuard

**Install**: `code --install-extension secret-guard-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `SecretGuard: Scan Workspace` | Run in any workspace | Scans all files, shows findings in Problems panel |
| `SecretGuard: Scan Current File` | Open a file, run command | Scans only active file |
| `SecretGuard: View Audit Report` | After scan, run command | Opens report (JSON/CSV options) |
| `SecretGuard: Add Ignore Pattern` | Run command | Prompts for pattern, adds to `.secretguardignore` |

**Test scenarios**:
- [ ] Create a file with `AKIA...` (AWS key pattern) — should detect as Critical
- [ ] Create a file with `password = "test123"` — should detect as Medium
- [ ] Create a file with `// secretguard-ignore-next-line` before secret — should ignore
- [ ] Scan on save triggers automatically (check settings)

---

### Focus Timer

**Install**: `code --install-extension focus-timer-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Focus Timer: Start Focus Session` | Run command | Timer starts, status bar shows countdown |
| `Focus Timer: Stop` | While timer running, run command | Timer stops, session logged |
| `Focus Timer: Pause / Resume` | While timer running, run command | Timer pauses/resumes |
| `Focus Timer: Start Break` | Run command | Break timer starts (default 5 min) |
| `Focus Timer: Show Session History` | After completing sessions, run command | Shows past sessions |

**Features to verify**:
- [ ] Status bar shows timer countdown
- [ ] Click status bar item toggles pause/resume
- [ ] Break reminder notification appears when focus session ends
- [ ] Session history persists across VS Code restarts

---

### Knowledge Decay Tracker

**Install**: `code --install-extension knowledge-decay-tracker-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Knowledge Decay: Scan Workspace` | Run in workspace | Scans for decay tags, shows staleness |
| `Knowledge Decay: Show Staleness Report` | After scan, run command | Shows report grouped by tier |
| `Knowledge Decay: Mark File as Fresh` | Open a file, run command | Updates file's freshness timestamp |
| `Knowledge Decay: Show Critical Files` | Run command | Shows only critical/overdue files |

**Test scenarios**:
- [ ] Create a markdown file with `<!-- review: 1d -->` — should show as due soon
- [ ] Create a file with `review: 2020-01-01` in frontmatter — should show as overdue
- [ ] Check status bar badge shows count of overdue documents

---

### Markdown to Word

**Install**: `code --install-extension markdown-to-word-*.vsix`

**Prerequisite**: Pandoc must be installed (`pandoc --version`)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Markdown to Word: Convert Current File` | Open .md file, run command | Creates .docx in same folder |
| `Markdown to Word: Convert With Options` | Open .md file, run command | Shows options (template, output path) |
| `Markdown to Word: Preview Diagrams` | Open .md with Mermaid, run command | Shows diagram preview |
| `Markdown to Word: Check Pandoc Installation` | Run command | Shows Pandoc version or error message |

**Test scenarios**:
- [ ] Convert markdown with headings, tables, code blocks
- [ ] Convert markdown with Mermaid diagram — should render as image
- [ ] Right-click .md file in Explorer — "Convert to Word" appears in context menu
- [ ] If Pandoc not installed, graceful error message

---

### Brandfetch Logo Fetcher

**Install**: `code --install-extension brandfetch-logo-fetcher-*.vsix`

**Prerequisite**: Brandfetch API key (optional — Logo.dev fallback works without)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Brandfetch: Fetch Logo by Domain` | Run command | Prompts for domain, shows logo options |
| `Brandfetch: Insert Logo at Cursor` | After fetch, run command | Inserts logo as markdown/SVG/URL |
| `Brandfetch: Clear Logo Cache` | Run command | Clears cached logos |
| `Brandfetch: Set API Key` | Run command | Prompts for Brandfetch API key, stores securely |

**Test scenarios**:
- [ ] Fetch logo for `github.com` — should return GitHub logo
- [ ] Without API key, Logo.dev fallback should work
- [ ] Insert as markdown: `![GitHub](https://...)`
- [ ] Insert as SVG URL
- [ ] Insert as base64 data URI

---

### AI Voice Reader

**Install**: `code --install-extension ai-voice-reader-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Voice Reader: Read Selection` | Select text, run command | Computer reads selection aloud |
| `Voice Reader: Read Entire Document` | Open file, run command | Reads entire file |
| `Voice Reader: Read File...` | Run command | File picker, then reads selected file |
| `Voice Reader: Stop` | While reading, run command | Stops playback |
| `Voice Reader: Set Voice` | Run command | Shows available system voices |

**Features to verify**:
- [ ] Web Speech API works (no API key required)
- [ ] Speed control in settings (0.5× to 2×)
- [ ] Different voices for different languages (check settings)

---

## Sprint 3 — Moderate Builds

### Dev Wellbeing

**Install**: `code --install-extension dev-wellbeing-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Dev Wellbeing: Start Monitoring` | Run command | Starts tracking session |
| `Dev Wellbeing: Stop Monitoring` | Run command | Stops tracking |
| `Dev Wellbeing: Show Session Stats` | After session, run command | Shows session statistics |
| `Dev Wellbeing: Configure Thresholds` | Run command | Opens settings for thresholds |

**Features to verify**:
- [ ] Posture reminder fires after configured interval (default 45 min)
- [ ] Eye strain break reminder fires (default 20 min)
- [ ] Hydration reminder fires (default 60 min)
- [ ] Frustration detection: rapid undo bursts trigger notification
- [ ] All notifications are non-blocking toasts

---

### PPTX Builder

**Install**: `code --install-extension pptx-builder-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `PPTX Builder: Create Presentation from Markdown` | Open .md file, run command | Creates .pptx file |
| `PPTX Builder: New Presentation Template` | Run command | Creates template .md file |
| `PPTX Builder: Preview Slide Structure` | Open .md, run command | Shows slide outline |
| `PPTX Builder: Open pptxgenjs Docs` | Run command | Opens docs in browser |

**Test scenarios**:
- [ ] `# Heading` becomes slide title
- [ ] `- bullet` becomes slide content
- [ ] Code blocks render as syntax-highlighted slides
- [ ] Speaker notes from `> blockquote` syntax

---

### Replicate Image Studio

**Install**: `code --install-extension replicate-image-studio-*.vsix`

**Prerequisite**: Replicate API key

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Replicate: Generate Image` | Run command | Prompts for prompt, model, generates image |
| `Replicate: Generate Video (WAN)` | Run command | Prompts for prompt, generates video |
| `Replicate: Set API Key` | Run command | Prompts for key, stores securely |
| `Replicate: View Generation History` | After generations, run command | Shows history |
| `Replicate: Insert Last Image as Markdown` | After generation, run command | Inserts `![](url)` |

**Model options to verify**:
- [ ] FLUX
- [ ] SDXL
- [ ] Stability AI

---

## Sprint 4 — Larger Builds

### Mermaid Diagram Pro

**Install**: `code --install-extension mermaid-diagram-pro-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Mermaid Pro: Preview Diagram at Cursor` | Cursor in Mermaid block, run command | Preview panel shows rendered diagram |
| `Mermaid Pro: Export as SVG` | In Mermaid block, run command | Exports to SVG file |
| `Mermaid Pro: Insert Diagram Template` | Run command | Shows template picker (flowchart, sequence, etc.) |
| `Mermaid Pro: Validate All Diagrams in File` | Open .md with Mermaid, run command | Validates all diagrams, shows errors |

**Templates to verify**:
- [ ] Flowchart
- [ ] Sequence diagram
- [ ] Class diagram
- [ ] ER diagram
- [ ] Gantt chart

---

### SVG Toolkit

**Install**: `code --install-extension svg-toolkit-*.vsix`

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `SVG Toolkit: Preview SVG` | Open .svg file, run command | Preview panel opens |
| `SVG Toolkit: Copy as Data URI` | Open .svg file, run command | Copies `data:image/svg+xml,...` to clipboard |
| `SVG Toolkit: Copy as Markdown Image` | Open .svg file, run command | Copies `![](...)` to clipboard |
| `SVG Toolkit: Insert Icon Template` | Run command | Shows icon template picker |
| `SVG Toolkit: Validate SVG` | Open .svg file, run command | Shows validation results |

**Context menu test**: Right-click .svg file in Explorer — preview option should appear.

---

### Gamma Slide Assistant

**Install**: `code --install-extension gamma-slide-assistant-*.vsix`

**Prerequisite**: Marp CLI for PDF export (`npm install -g @marp-team/marp-cli`)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Gamma Slides: Export as HTML` | Open Marp .md, run command | Creates HTML file |
| `Gamma Slides: Export as PDF` | Open Marp .md, run command | Creates PDF file |
| `Gamma Slides: Preview in Browser` | Open Marp .md, run command | Opens preview in browser |
| `Gamma Slides: Insert Marp Frontmatter` | Open .md, run command | Inserts Marp frontmatter at top |
| `Gamma Slides: New Presentation` | Run command | Creates new .md with Marp template |

**Themes to verify**:
- [ ] Minimal
- [ ] Corporate
- [ ] Dark
- [ ] Academic

---

## Quick Reference — All Commands by Extension

| Extension | Commands |
|-----------|----------|
| **Hook Studio** | `hookStudio.open`, `hookStudio.testCondition`, `hookStudio.importFromAlex`, `hookStudio.exportHooks` |
| **Workspace Watchdog** | `workspaceWatchdog.showDashboard`, `workspaceWatchdog.scanNow`, `workspaceWatchdog.showHotFiles`, `workspaceWatchdog.showStalledFiles`, `workspaceWatchdog.clearHistory` |
| **MCP App Starter** | `mcpAppStarter.create`, `mcpAppStarter.addTool`, `mcpAppStarter.addResource`, `mcpAppStarter.validate`, `mcpAppStarter.openDocs` |
| **SecretGuard** | `secretGuard.scanWorkspace`, `secretGuard.scanFile`, `secretGuard.viewReport`, `secretGuard.addIgnorePattern` |
| **Focus Timer** | `focusTimer.start`, `focusTimer.stop`, `focusTimer.pause`, `focusTimer.startBreak`, `focusTimer.showHistory` |
| **Knowledge Decay Tracker** | `knowledgeDecay.scanWorkspace`, `knowledgeDecay.showReport`, `knowledgeDecay.touchFile`, `knowledgeDecay.showCritical` |
| **Markdown to Word** | `markdownToWord.convert`, `markdownToWord.convertWithOptions`, `markdownToWord.preview`, `markdownToWord.checkPandoc` |
| **Brandfetch Logo Fetcher** | `brandfetch.fetchLogo`, `brandfetch.insertLogo`, `brandfetch.clearCache`, `brandfetch.setApiKey` |
| **AI Voice Reader** | `voiceReader.readSelection`, `voiceReader.readDocument`, `voiceReader.readFile`, `voiceReader.stop`, `voiceReader.setVoice` |
| **Dev Wellbeing** | `devWellbeing.start`, `devWellbeing.stop`, `devWellbeing.showStats`, `devWellbeing.configureLimits` |
| **PPTX Builder** | `pptxBuilder.create`, `pptxBuilder.newTemplate`, `pptxBuilder.preview`, `pptxBuilder.openDocs` |
| **Replicate Image Studio** | `replicateStudio.generate`, `replicateStudio.generateVideo`, `replicateStudio.setApiKey`, `replicateStudio.viewHistory`, `replicateStudio.insertMarkdown` |
| **Mermaid Diagram Pro** | `mermaidPro.preview`, `mermaidPro.exportSvg`, `mermaidPro.insertTemplate`, `mermaidPro.validateAll` |
| **SVG Toolkit** | `svgToolkit.preview`, `svgToolkit.copyDataUri`, `svgToolkit.copyMarkdown`, `svgToolkit.insertIconTemplate`, `svgToolkit.validateSvg` |
| **Gamma Slide Assistant** | `gammaSlides.convertToHtml`, `gammaSlides.convertToPdf`, `gammaSlides.preview`, `gammaSlides.insertFrontmatter`, `gammaSlides.newPresentation` |
