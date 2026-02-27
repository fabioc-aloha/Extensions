# Test Guide — Extensions Monorepo

**Testing Method**: Local VSIX installation (not F5/Extension Development Host)

---

## General Testing Workflow

### Bulk Install (Recommended)

Builds, packages, and installs all 16 extensions in one step:

```bash
node scripts/install-all-local.js
```

Then reload VS Code: `Ctrl+Shift+P` → `Developer: Reload Window`

### Single Extension

```bash
# 1. Navigate to extension folder
cd extensions/<extension-name>

# 2. Compile
npm run compile     # or: npm run bundle

# 3. Package
npx vsce package --no-dependencies

# 4. Verify no secrets bundled
npx vsce ls

# 5. Install locally
code --install-extension <extension-name>-*.vsix --force

# 6. Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")

# 7. Test commands and features (see below)

# 8. Uninstall when done testing
code --uninstall-extension fabioc-aloha.<extension-name>
```

---

## CX Tools Submenu — Global Verification

All 14 extensions with context menu contributions share a unified **CX Tools** submenu. Verify once after install:

**Explorer context menu:**
- [ ] Right-click any file in Explorer → `$(tools) CX Tools` entry appears
- [ ] Hover over `CX Tools` → submenu expands with relevant extension commands
- [ ] Right-click a `.md` file → CX Tools contains Markdown to Word, Mermaid, Gamma Slides commands
- [ ] Right-click a `.svg` file → CX Tools contains SVG Toolkit commands

**Editor context menu:**
- [ ] Right-click inside any editor → `$(tools) CX Tools` entry appears
- [ ] Submenu shows appropriate commands for the current file type

**URI consumption (Explorer right-click):**
- [ ] Right-click a file → CX Tools → SecretGuard Scan File → scans that file directly (no dialog)
- [ ] Right-click a `.md` file → CX Tools → Convert to Word → converts that file directly
- [ ] Right-click any file → CX Tools → Mark as Fresh → marks that file directly

**Selected text pre-fill (Editor right-click):**
- [ ] Select a domain name (e.g. `github.com`) → CX Tools → Fetch Logo → domain field pre-filled
- [ ] Select prompt text → CX Tools → Generate Image → prompt field pre-filled
- [ ] Select text → CX Tools → Read Selection/Document → reads selection
- [ ] No selection → CX Tools → Read Selection/Document → reads entire document

---

## Sprint 1 — First Movers

### Hook Studio ✅ Published

**Marketplace**: [fabioc-aloha.hook-studio](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.hook-studio)

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

### Workspace Watchdog ✅ Published

**Marketplace**: [fabioc-aloha.cx-workspace-watchdog](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-workspace-watchdog)

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

### MCP App Starter ✅ Published

**Marketplace**: [fabioc-aloha.mcp-app-starter](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mcp-app-starter)

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

### SecretGuard ✅ Published

**Marketplace**: [fabioc-aloha.cx-secret-guard](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-secret-guard)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `SecretGuard: Scan Workspace` | Run in any workspace | Scans all files, shows findings in Problems panel |
| `SecretGuard: Scan Current File` | Open a file, run command | Scans only active file |
| `SecretGuard: View Audit Report` | After scan, run command | Opens report (JSON/CSV options) |
| `SecretGuard: Add Ignore Pattern` | Run command | Prompts for pattern, adds to `.secretguardignore` |

**Context menu test** (URI consumption):
- [ ] Right-click any file in Explorer → CX Tools → Scan File → scans **that file directly** (no picker dialog)

**Test scenarios**:
- [ ] Create a file with `AKIA...` (AWS key pattern) — should detect as Critical
- [ ] Create a file with `password = "test123"` — should detect as Medium
- [ ] Create a file with `// secretguard-ignore-next-line` before secret — should ignore
- [ ] Scan on save triggers automatically (check settings)

---

### Focus Timer ✅ Published

**Marketplace**: [fabioc-aloha.cx-focus-timer](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-focus-timer)

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

### Knowledge Decay Tracker ✅ Published

**Marketplace**: [fabioc-aloha.knowledge-decay-tracker](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.knowledge-decay-tracker)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Knowledge Decay: Scan Workspace` | Run in workspace | Scans for decay tags, shows staleness |
| `Knowledge Decay: Show Staleness Report` | After scan, run command | Shows report grouped by tier |
| `Knowledge Decay: Mark File as Fresh` | Open a file, run command | Updates file's freshness timestamp |
| `Knowledge Decay: Show Critical Files` | Run command | Shows only critical/overdue files |

**Context menu test** (URI consumption):
- [ ] Right-click any file in Explorer → CX Tools → Mark as Fresh → marks **that file** (no picker dialog)

**Test scenarios**:
- [ ] Create a markdown file with `<!-- review: 1d -->` — should show as due soon
- [ ] Create a file with `review: 2020-01-01` in frontmatter — should show as overdue
- [ ] Check status bar badge shows count of overdue documents

---

### Markdown to Word ✅ Published

**Marketplace**: [fabioc-aloha.cx-markdown-to-word](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.cx-markdown-to-word)

**Prerequisite**: Pandoc must be installed (`pandoc --version`)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Markdown to Word: Convert Current File` | Open .md file, run command | Creates .docx in same folder |
| `Markdown to Word: Convert With Options` | Open .md file, run command | Shows options (template, output path) |
| `Markdown to Word: Preview Diagrams` | Open .md with Mermaid, run command | Shows diagram preview |
| `Markdown to Word: Check Pandoc Installation` | Run command | Shows Pandoc version or error message |

**Context menu test** (URI consumption):
- [ ] Right-click a `.md` file in Explorer → CX Tools → Convert to Word → converts **that file directly** (no picker dialog)
- [ ] File does not need to be open first — works from Explorer before the file is loaded

**Test scenarios**:
- [ ] Convert markdown with headings, tables, code blocks
- [ ] Convert markdown with Mermaid diagram — should render as image
- [ ] If Pandoc not installed, graceful error message

---

### Brandfetch Logo Fetcher ✅ Published

**Marketplace**: [fabioc-aloha.brandfetch-logo-fetcher](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.brandfetch-logo-fetcher)

**Prerequisite**: Brandfetch API key (optional — Logo.dev fallback works without)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Brandfetch: Fetch Logo by Domain` | Run command | Prompts for domain, shows logo options |
| `Brandfetch: Insert Logo at Cursor` | After fetch, run command | Inserts logo as markdown/SVG/URL |
| `Brandfetch: Clear Logo Cache` | Run command | Clears cached logos |
| `Brandfetch: Set API Key` | Run command | Prompts for Brandfetch API key, stores securely |

**Selected text pre-fill test**:
- [ ] Select `github.com` in editor → CX Tools → Fetch Logo → domain input pre-filled with `github.com`
- [ ] Select `github.com` in editor → CX Tools → Insert Logo → domain input pre-filled

**Test scenarios**:
- [ ] Fetch logo for `github.com` — should return GitHub logo
- [ ] Without API key, Logo.dev fallback should work
- [ ] Insert as markdown: `![GitHub](https://...)`
- [ ] Insert as SVG URL
- [ ] Insert as base64 data URI

---

### AI Voice Reader ✅ Published

**Marketplace**: [fabioc-aloha.ai-voice-reader](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.ai-voice-reader)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `Voice Reader: Read Selection / Document` | Select text or open file, run command | Reads selection if selected, else reads full document |
| `Voice Reader: Read File...` | Run command | File picker opens, then reads the selected file |
| `Voice Reader: Stop` | While reading, run command | Stops playback immediately |
| `Voice Reader: Set Voice` | Run command | Shows available system voices |

**Selection behavior test**:
- [ ] Select a paragraph → CX Tools → Read Selection/Document → reads **only the selection**
- [ ] No selection → CX Tools → Read Selection/Document → reads **entire document**
- [ ] Both cases use the same single command — no separate "read document" entry needed

**Features to verify**:
- [ ] Web Speech API works (no API key required)
- [ ] Speed control in settings (0.5× to 2×)
- [ ] Different voices for different languages (check settings)

---

## Sprint 3 — Moderate Builds

### Dev Wellbeing ✅ Published

**Marketplace**: [fabioc-aloha.dev-wellbeing](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.dev-wellbeing)

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

### PPTX Builder ✅ Published

**Marketplace**: [fabioc-aloha.pptx-builder](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.pptx-builder)

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

### Replicate Image Studio ✅ Published

**Marketplace**: [fabioc-aloha.replicate-image-studio](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.replicate-image-studio)

**Prerequisite**: Replicate API key

| Command | How to Test | Expected Result |
|---------|-------------|-----------------||
| `Replicate: Generate Image` | Run command | Prompts for prompt, model, generates image |
| `Replicate: Generate Video (WAN)` | Run command | Prompts for prompt, generates video |
| `Replicate: Set API Key` | Run command | Prompts for key, stores securely |
| `Replicate: View Generation History` | After generations, run command | Shows history |
| `Replicate: Insert Last Image as Markdown` | After generation, run command | Inserts `![](url)` |

**Selected text pre-fill test**:
- [ ] Select a prompt in editor (e.g. `a red fox in a snowy forest`) → CX Tools → Generate Image → prompt pre-filled
- [ ] Select text → CX Tools → Generate Video → prompt pre-filled

**Model options to verify**:
- [ ] FLUX
- [ ] SDXL
- [ ] Stability AI

---

## Sprint 4 — Larger Builds

### Mermaid Diagram Pro ✅ Published

**Marketplace**: [fabioc-aloha.mermaid-diagram-pro](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.mermaid-diagram-pro)

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

### SVG Toolkit ✅ Published

**Marketplace**: [fabioc-aloha.svg-toolkit](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.svg-toolkit)

| Command | How to Test | Expected Result |
|---------|-------------|-----------------|
| `SVG Toolkit: Preview SVG` | Open .svg file, run command | Preview panel opens |
| `SVG Toolkit: Copy as Data URI` | Open .svg file, run command | Copies `data:image/svg+xml,...` to clipboard |
| `SVG Toolkit: Copy as Markdown Image` | Open .svg file, run command | Copies `![](...)` to clipboard |
| `SVG Toolkit: Insert Icon Template` | Run command | Shows icon template picker |
| `SVG Toolkit: Validate SVG` | Open .svg file, run command | Shows validation results |

**Context menu test**: Right-click `.svg` file in Explorer → CX Tools → Preview/Copy commands appear.

---

### Gamma Slide Assistant ✅ Installed Locally · ⏳ Marketplace Pending (rate-limited — publish after ~12h)

**Install**: `code --install-extension gamma-slide-assistant-*.vsix --force` (or use bulk script)

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

## Quick Reference — Installed Versions

| Extension | Publisher ID | Version | Status |
|-----------|-------------|---------|--------|
| AI Voice Reader | `fabioc-aloha.ai-voice-reader` | 0.1.5 | ✅ Published |
| Brandfetch Logo Fetcher | `fabioc-aloha.brandfetch-logo-fetcher` | 0.1.4 | ✅ Published |
| Dev Wellbeing | `fabioc-aloha.dev-wellbeing` | 0.1.1 | ✅ Published |
| Focus Timer | `fabioc-aloha.cx-focus-timer` | 0.1.0 | ✅ Published |
| Gamma Slide Assistant | `fabioc-aloha.gamma-slide-assistant` | 0.1.0 | ✅ Published |
| Hook Studio | `fabioc-aloha.hook-studio` | 0.1.7 | ✅ Published |
| Knowledge Decay Tracker | `fabioc-aloha.knowledge-decay-tracker` | 0.1.5 | ✅ Published |
| Markdown to Word | `fabioc-aloha.cx-markdown-to-word` | 0.1.0 | ✅ Published |
| MCP App Starter | `fabioc-aloha.mcp-app-starter` | 0.1.8 | ✅ Published |
| Mermaid Diagram Pro | `fabioc-aloha.mermaid-diagram-pro` | 0.1.1 | ✅ Published |
| PPTX Builder | `fabioc-aloha.pptx-builder` | 0.1.1 | ✅ Published |
| Replicate Image Studio | `fabioc-aloha.replicate-image-studio` | 0.1.1 | ✅ Published |
| SecretGuard | `fabioc-aloha.cx-secret-guard` | 0.1.4 | ✅ Published |
| SVG To PNG | `fabioc-aloha.svg-to-png` | 0.1.0 | ✅ Published |
| SVG Toolkit | `fabioc-aloha.svg-toolkit` | 0.1.1 | ✅ Published |
| Workspace Watchdog | `fabioc-aloha.cx-workspace-watchdog` | 0.1.7 | ✅ Published |

---

## Quick Reference — All Commands

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
| **AI Voice Reader** | `voiceReader.readSelection`, `voiceReader.readFile`, `voiceReader.stop`, `voiceReader.setVoice` |
| **Dev Wellbeing** | `devWellbeing.start`, `devWellbeing.stop`, `devWellbeing.showStats`, `devWellbeing.configureLimits` |
| **PPTX Builder** | `pptxBuilder.create`, `pptxBuilder.newTemplate`, `pptxBuilder.preview`, `pptxBuilder.openDocs` |
| **Replicate Image Studio** | `replicateStudio.generate`, `replicateStudio.generateVideo`, `replicateStudio.setApiKey`, `replicateStudio.viewHistory`, `replicateStudio.insertMarkdown` |
| **Mermaid Diagram Pro** | `mermaidPro.preview`, `mermaidPro.exportSvg`, `mermaidPro.insertTemplate`, `mermaidPro.validateAll` |
| **SVG Toolkit** | `svgToolkit.preview`, `svgToolkit.copyDataUri`, `svgToolkit.copyMarkdown`, `svgToolkit.insertIconTemplate`, `svgToolkit.validateSvg` |
| **Gamma Slide Assistant** | `gammaSlides.convertToHtml`, `gammaSlides.convertToPdf`, `gammaSlides.preview`, `gammaSlides.insertFrontmatter`, `gammaSlides.newPresentation` |
