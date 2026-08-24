# Extension Competitive Innovation Plan

## Objective

Close feature, reliability, and discoverability gaps in the published CX
extension portfolio while preserving a distinct reason to install each
extension alongside native VS Code features and established Marketplace tools.

This plan is based on a source review and competitive research snapshot from
2026-08-23. The Marketplace install counts below are the supplied publisher
snapshot and should be refreshed before deciding a release order.

## Portfolio Rules

1. **Truth before growth.** Correct every README, CHANGELOG, Marketplace
   description, and setting that promises behavior absent from source before
   promoting that extension.
2. **Differentiate, do not clone.** Where VS Code or a dominant extension
   already owns preview or editing, move CX toward a workflow that the
   incumbent does not provide.
3. **Ship one focused outcome per release.** Each v0.2 release needs a
   demonstrable workflow, a GIF or screenshot, and one measurable adoption
   hypothesis.
4. **Protect local-first behavior.** Do not add an API, cloud dependency, or
   telemetry without a user-visible benefit, opt-in decision, and documented
   failure state.
5. **Validate current platform contracts.** Before each implementation,
   confirm the relevant VS Code, Copilot, MCP, and third-party API contracts.

## Priority Model

Priority blends current installs, severity of known product gaps, strength of
the differentiated niche, platform displacement risk, and implementation
feasibility. Download count breaks ties; it is not the only signal.

| Order | Extension | Installs | Priority | v0.2 outcome | First release scope |
|---:|---|---:|---|---|---|
| 1 | CX Markdown to Word | 547 | P0 | Zero-friction DOCX conversion | Built-in `docx` quick path plus accurate batch-convert status |
| 2 | CX SVG to PNG | 358 | P0 | Production icon pipeline | Icon-set export, output-folder setting, correct SVG activation |
| 3 | CX AI Voice Reader | 327 | P0 | Developer proof-reading companion | Remove or implement Azure setting; chunking, pause/resume, real voice picker |
| 4 | CX PPTX Builder | 334 | P0 | Branded technical deck generator | Correct claims and ship themes with real slide masters |
| 5 | CX Hook Studio | 114 | P0 | Schema-aware hook recipe studio | Support modern `.github/hooks/*.json` schema and curated templates |
| 6 | CX Gamma Slide Assistant | 116 | P0 decision | Defensible presentation product or retirement | Correct claims, rebrand decision, and evaluate merge with PPTX Builder |
| 7 | CX Mermaid Diagram Pro | 75 | P0 | Export-first Mermaid tooling | Offline bundled render path, `.mmd` support, diagnostics |
| 8 | CX Replicate Image Studio | 44 | P1 | Persistent visual creative studio | Persist history, wire cancellation, add negative prompts |
| 9 | CX SVG Toolkit | 28 | P1 | SVG developer workbench | Deliver SVGO and live preview; state scope versus SVG to PNG |
| 10 | CX Brandfetch Logo Fetcher | 20 | P1 | Reliable in-editor brand kit | Remove public fallback token and honor selected insertion format |
| 11 | CX MCP App Starter | 7 | P1 | VS Code-native MCP development loop | Replace stub commands and validate current MCP configuration |
| 12 | CX Workspace Watchdog | 7 | P1 | Copilot session health monitor | Repair stalled/TODO/tree-view features before adding agent insights |
| 13 | CX SecretGuard | 4 | P1 | Lightweight AI-aware secret gate | Align pattern claims, reduce false positives, add ignore-file support |
| 14 | CX Knowledge Decay Tracker | 2 | P1 | Defensible knowledge-freshness tool | Fix per-file decay tags and real usage/activity scoring |
| 15 | CX Dev Wellbeing | 2 | P2 | Context-aware developer recovery aid | Persist baseline behavior, then add transparent stress-signal rules |
| 16 | CX Focus Timer | 0 | P2 | Local-first annotated focus tracker | Persist sessions, attach work notes, correct category metadata |

## Release Tranches

### Tranche 0 - Portfolio credibility baseline

Apply this gate before feature work on any extension.

1. Compare each README, CHANGELOG, Marketplace description, package setting,
   and command contribution against source.
2. Correct unsupported claims or explicitly mark them as planned.
3. Add one workflow GIF or screenshot to each Marketplace README, beginning
   with the top six installed extensions.
4. Verify categories, keywords, activation events, and current VS Code engine
   compatibility.
5. Publish a short v0.1.x corrective release only where a false claim or
   runtime defect is materially affecting users.

### Tranche 1 - Demand-led workflow upgrades

Work sequentially through the first four extensions:

1. **Markdown to Word:** Offer a no-Pandoc basic DOCX path, then add a
   Word-like preview and the missing batch conversion workflow. Preserve the
   Pandoc path for Mermaid and advanced templates.
2. **SVG to PNG:** Own icon production, not generic preview. Add preset
   multi-size exports, output location control, `onLanguage:svg`, and an
   optional watch mode.
3. **AI Voice Reader:** Own document proof-reading, not generic speech.
   Make playback reliable before adding sentence highlighting and review flags.
4. **PPTX Builder:** Position around branded, code-friendly PPTX output.
   Ship themes first, then images/diagrams and preview. Do not compete as a
   thinner Marp wrapper.

### Tranche 2 - Platform-risk pivots

1. **Hook Studio:** The native VS Code hooks editor now covers basic file
   editing. Become the source of validated recipes, full schema form editing,
   static dry runs, and safe migration of hook files.
2. **Gamma Slide Assistant:** Decide whether a renamed CX Slide Publisher can
   differentiate through publication workflow, or merge it into a single CX
   Presentation Suite with PPTX Builder. Do not continue as a weaker Marp
   wrapper under the Gamma name.
3. **Mermaid Diagram Pro:** VS Code includes Mermaid preview. Pivot to offline
   rendering, export, templates, diagnostics, and GitHub compatibility checks.

### Tranche 3 - Specialist workflows

1. **Replicate Image Studio:** Make every generation durable, cancellable, and
   inspectable in an in-editor gallery before adding chat or MCP integration.
2. **SVG Toolkit:** Establish a clear boundary: Toolkit creates, validates,
   optimizes, and recolors SVG; SVG to PNG rasterizes and produces asset sets.
3. **Brandfetch Logo Fetcher:** Fix the Logo.dev fallback and format behavior,
   then expand from one logo URL to variants, palette extraction, and a bulk
   brand-table workflow.
4. **MCP App Starter:** Turn the wizard into a development loop: current
   templates, real tool/resource insertion, schema diagnostics, HTTP support,
   and `.vscode/mcp.json` registration.
5. **Workspace Watchdog:** Repair the unpopulated stall and TODO signals plus
   the empty tree view, then differentiate with a transparent Copilot-session
   health view rather than generic Git history.
6. **SecretGuard:** Compete as a local, fast companion to AI coding. Improve
   pattern quality and ignore controls before adding a pre-commit generator or
   chat experience.

### Tranche 4 - Uncontested and emerging opportunities

1. **Knowledge Decay Tracker:** Fix `parseTag()` use and the hardcoded
   `referenceCount`, then add auto-scan and a sorted staleness dashboard.
   This is the strongest unique niche despite low current installs.
2. **Dev Wellbeing:** Build transparent, user-controllable stress signals from
   undo bursts and diagnostics; never characterize users or make health claims.
3. **Focus Timer:** Persist local history, add optional session notes and
   daily streaks, then offer an opt-in handoff to Dev Wellbeing reminders.
4. **Alex migration discovery:** Without changing the deprecated Alex
   extension, cross-reference relevant standalone CX tools in the Alex ACT
   Core migration documentation after the target products are reliable.

## Extension-Level Definition of Done

For each extension, do not publish until all apply:

- The documented feature exists in source and has a targeted test or manual
  verification path.
- The primary workflow works without an undisclosed external prerequisite.
- Error, cancellation, offline, and missing-tool states are user actionable.
- The package contains all runtime dependencies and installs from its VSIX.
- The README shows the workflow with a current screenshot or GIF.
- The Marketplace metadata uses accurate categories, keywords, and description.
- The extension's v0.2 thesis remains distinct from current VS Code and the
  identified competitor set.

## Shared Investments

| Investment | Consumers | Rationale |
|---|---|---|
| Local rasterization service using `resvg` | SVG to PNG, SVG Toolkit, Mermaid Diagram Pro | Remove duplicate export work and reduce external CLI requirements |
| Live-preview utility | SVG Toolkit, Mermaid Diagram Pro, presentation tools | Consistent document-change handling and webview messaging |
| Presentation strategy | PPTX Builder, Gamma Slide Assistant | Avoid two competing products with overlapping Markdown-to-slide workflows |
| CX Tools menu governance | Entire portfolio | Prevent the shared submenu from becoming cluttered or ambiguous |
| Marketplace evidence kit | Entire portfolio | Reusable GIF/screenshot capture guidance, install baseline, and release checklist |
| Local-first state helpers | Voice Reader, Replicate, Focus Timer, Wellbeing, Knowledge Decay | Consistent persistence, retention, reset, and user control |

## Portfolio Measures

Record a baseline before the first v0.2 release, then review after 28 days.

| Measure | Target |
|---|---|
| Install velocity | Increase installs per 28 days for the released extension |
| Activation reliability | No known blocker in first-run, offline, or missing-tool flow |
| Promise accuracy | Zero unsupported Marketplace/README/CHANGELOG claims |
| Workflow proof | At least one current GIF or screenshot per published extension |
| Cross-installation | Track README referral clicks or user feedback before claiming suite synergy |
| Maintenance load | No duplicate capability without an explicit scope boundary |

## Research Evidence

- [VS Code hooks reference](https://code.visualstudio.com/docs/agents/reference/hooks-reference)
- [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [VS Code Mermaid preview in 1.121](https://code.visualstudio.com/updates/v1_121#_mermaid-diagrams-in-markdown-preview-and-notebooks)
- [Official Marp extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- [jock.svg](https://marketplace.visualstudio.com/items?itemName=jock.svg)
- [Replicate MCP server announcement](https://replicate.com/changelog/2026-02-10-mcp-server-auto-discovery)
- [VS Code Speech extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-speech)
- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- Local source audits in `extensions/*/src`, `shared/`, `README.md`,
  `ROADMAP.md`, and `TODO.md`.

## Decision Gates

1. Before Tranche 1, approve the claim-correction approach: remove unsupported
   historical claims or implement them.
2. Before the presentation work, choose whether Gamma Slide Assistant is
   renamed, merged, or retired.
3. Before Chat Participant or MCP work, verify the target VS Code APIs and
   user authentication model at implementation time.
4. Before any cloud-connected feature, approve the pricing, consent, and
   failure-state UX.
