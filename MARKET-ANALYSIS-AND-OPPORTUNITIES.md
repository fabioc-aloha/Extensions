# Market Analysis and Opportunities

## Scope and Method

This document summarizes a source-level review of the 16 published
`fabioc-aloha` VS Code extensions and a competitive scan performed on
2026-08-23. It complements [PLAN.md](./PLAN.md): this document explains the
market evidence and opportunities; the plan defines the execution order.

Marketplace install counts are the publisher snapshot supplied on 2026-08-23.
They are useful for prioritization but should be refreshed before setting
release targets. Competitor capabilities and third-party APIs also require
verification immediately before implementation.

## Executive Assessment

The portfolio has four strengths:

1. **Demand already exists for focused conversion tools.** Markdown to Word,
   SVG to PNG, AI Voice Reader, and PPTX Builder account for most observed
   installs.
2. **Several extensions have a credible niche that major incumbents do not
   serve.** Knowledge Decay Tracker, Dev Wellbeing, Hook recipe curation, and
   document proof-reading have differentiated potential.
3. **The CX suite can compound value.** Shared rendering, persistence,
   Marketplace evidence, and carefully scoped integrations can reduce repeated
   work without collapsing distinct products into one.
4. **The first release wave shipped ahead of product hardening.** Several
   public claims, roadmap items, commands, and settings do not match current
   source. Correctness and trust are the first growth lever.

The portfolio should not try to out-feature platform defaults or market
leaders. It should own narrow, high-value workflows: zero-friction DOCX
output, production asset generation, proof-reading by voice, schema-aware hook
recipes, and local-first knowledge freshness.

## Publisher Snapshot

| Extension | Installs | Current signal |
|---|---:|---|
| CX Markdown to Word | 547 | Strongest product-market signal |
| CX SVG to PNG | 358 | Strong technical foundation and stale competitor opening |
| CX PPTX Builder | 334 | Demand exists; output quality must improve |
| CX AI Voice Reader | 327 | Clear document proof-reading niche |
| CX Gamma Slide Assistant | 116 | Strategic overlap and naming issue |
| CX Hook Studio | 114 | Valuable early adopter base but schema/platform risk |
| CX Mermaid Diagram Pro | 75 | Native VS Code preview changed the category |
| CX Replicate Image Studio | 44 | Promising workflow, needs durable UX |
| CX SVG Toolkit | 28 | Large delivery gap versus claimed scope |
| CX Brandfetch Logo Fetcher | 20 | Niche workflow with API reliability risk |
| CX MCP App Starter | 7 | Low installs, high ecosystem upside |
| CX Workspace Watchdog | 7 | Advertised core signals are not yet populated |
| CX SecretGuard | 4 | Crowded market; trust and precision required |
| CX Dev Wellbeing | 2 | Unique idea not yet implemented |
| CX Knowledge Decay Tracker | 2 | Uncontested niche with fixable core defects |
| CX Focus Timer | 0 | Fragmented category; local-first differentiation possible |

The deprecated Alex extension has 99 installs but is outside this repository.
It is a discovery and migration channel, not a product to revive.

## Competition Intelligence Ledger

`Extension updated` records a source, README, or package update prepared in
this repository. It does not mean the version has been published to the
Marketplace.

| Extension | Date researched | Extension updated | Current action |
|---|---|---|---|
| CX Markdown to Word | 2026-08-23 | 2026-08-23 | v0.2 folder conversion and native preview prepared |
| CX SVG to PNG | 2026-08-23 | 2026-08-23 | v0.2 icon-set and batch workflow prepared |
| CX AI Voice Reader | 2026-08-23 | 2026-08-23 | v0.2 local voice and playback reliability prepared |
| CX PPTX Builder | 2026-08-23 | 2026-08-23 | v0.2 themes and continuation slides prepared |
| CX Gamma Slide Assistant | 2026-08-23 | 2026-08-23 | v0.2 Gamma API generation and local Marp workflow prepared |
| CX Hook Studio | 2026-08-23 | — | Current hook schema and recipe work pending |
| CX Mermaid Diagram Pro | 2026-08-23 | — | Offline export and diagnostics work pending |
| CX Replicate Image Studio | 2026-08-23 | — | Persistence and gallery work pending |
| CX SVG Toolkit | 2026-08-23 | — | SVG workbench work pending |
| CX Brandfetch Logo Fetcher | 2026-08-23 | — | API reliability work pending |
| CX MCP App Starter | 2026-08-23 | — | Development-loop work pending |
| CX Workspace Watchdog | 2026-08-23 | — | Core signal repair pending |
| CX SecretGuard | 2026-08-23 | — | Pattern credibility work pending |
| CX Knowledge Decay Tracker | 2026-08-23 | — | Core scoring repair pending |
| CX Dev Wellbeing | 2026-08-23 | — | Context-aware recovery work pending |
| CX Focus Timer | 2026-08-23 | — | Persistence and annotation work pending |

## Market Shifts

### Native VS Code now owns the baseline

| Area | Market change | Implication |
|---|---|---|
| Mermaid | VS Code 1.121 added Mermaid support in Markdown previews and notebooks | Mermaid Diagram Pro must lead with offline export, diagnostics, templates, and compatibility instead of preview |
| Agent hooks | VS Code added a Hooks surface and modernized the hook schema | Hook Studio must support current multi-file hooks and become a recipe/schema tool |
| MCP | VS Code exposes MCP discovery and configuration flows | MCP App Starter must serve the development loop after discovery: scaffold, edit, validate, inspect, register |
| Speech | Microsoft offers Copilot- and dictation-oriented speech tooling | AI Voice Reader should focus on document proof-reading, position tracking, and review workflow |

### Incumbents set a high bar

| Segment | Incumbents | CX response |
|---|---|---|
| Presentations | Marp, Slidev, Reveal.js | Use branded native PPTX output and publishing workflows rather than a thinner Marp wrapper |
| Security | GitHub secret scanning, Snyk, Trivy, TruffleHog | Be a fast local AI-coding guard; do not claim enterprise scanning parity |
| Git and task awareness | GitLens, Todo Tree | Pivot Watchdog toward transparent Copilot session health after repairing basic signals |
| SVG tools | jock.svg, Draw.io | Make SVG Toolkit a modern developer workbench and SVG to PNG the production asset pipeline |
| Productivity | WakaTime, Code Time, Pomodoro tools | Stay local-first and connect focused work, ergonomic breaks, and developer context |

## Opportunity Themes

### 1. Trust and promise accuracy

This is the portfolio's immediate opportunity and risk. Several CHANGELOG,
ROADMAP, README, Marketplace, or package-setting claims do not match source.
Before adding new capabilities:

- Remove or mark unsupported historical claims as planned.
- Repair settings that cannot work, especially the Azure voice engine setting.
- Make stub commands functional or remove them from the product surface.
- Align security pattern counts with implementation.
- Add screenshots or short workflow GIFs to listings.

Trust repair is not a documentation exercise; it prevents users from
installing, failing, and leaving before the product reaches its actual value.

### 2. Remove first-run friction

The highest-install products have external or unclear prerequisites:

- Markdown to Word depends on Pandoc and optionally Mermaid CLI.
- Gamma Slide Assistant shells out through `npx`.
- Mermaid export relies on heavy CLI setup.
- Brandfetch falls back to a public, rate-limited Logo.dev token.

The opportunity is not to remove every dependency. It is to offer a clear
basic path, disclose the advanced path, and make missing-tool errors
actionable.

### 3. Defend through workflow ownership

CX should focus on workflows that the platform or incumbent does not make
easy:

| Workflow | Candidate owner | Defensible outcome |
|---|---|---|
| Markdown to styled DOCX | Markdown to Word | Basic built-in DOCX, style wizard, batch conversion |
| SVG to production icon set | SVG to PNG | Multi-size output, watch mode, asset-folder control |
| Documentation proof-reading | AI Voice Reader | Chunked playback, sentence highlight, review flags |
| Hook recipe adoption | Hook Studio | Schema-aware templates and static dry run |
| Knowledge freshness | Knowledge Decay Tracker | Per-file decay profiles, git-aware scoring, dashboard |
| Developer recovery | Dev Wellbeing | Transparent context-aware break suggestions |
| Agent session health | Workspace Watchdog | AI-touched files, unresolved TODOs, test/health visibility |

### 4. Reuse without product confusion

Shared components are worthwhile only when the customer-facing boundary remains
clear:

- Share local SVG rasterization across SVG to PNG, SVG Toolkit, and Mermaid
  export.
- Share persistence, retention, reset, and user-control conventions across
  Voice Reader, Replicate, Focus Timer, Wellbeing, and Knowledge Decay.
- Establish one presentation strategy for PPTX Builder and Gamma Slide
  Assistant before funding both independently.
- Govern the shared `cx.tools` submenu so the extension family does not add
  ambiguous menu entries.

## Per-Extension Opportunity Map

| Extension | Competitive gap | Recommended position | Immediate opportunity |
|---|---|---|---|
| Markdown to Word | Pandoc friction; no preview; missing batch command | Zero-friction DOCX factory | Built-in basic DOCX path and accurate batch status |
| SVG to PNG | Stale SVG competitor; no icon-set workflow | Production asset pipeline | Multi-size icon export, output folder, SVG activation |
| AI Voice Reader | Microsoft speech is broad but not document review | Proof-reader companion | Chunking, pause/resume, voice picker, remove or implement Azure |
| PPTX Builder | Marp has better preview/export ecosystem | Branded technical PPTX engine | Truthful docs and themes with native slide masters |
| Gamma Slide Assistant | Paid Gamma account and API-credit boundary | Hybrid local Marp and Gamma workflow | Maintain Gamma API contract and document input limits |
| Hook Studio | Native hooks editor and new schema | Hook template and validation studio | Multi-file schema support and curated recipes |
| Mermaid Diagram Pro | Native VS Code preview | Offline export and compatibility tooling | Local Mermaid, `.mmd` support, diagnostics |
| Replicate Image Studio | Official Replicate MCP offers chat-first path | Persistent visual creative studio | Saved history, cancellation, negative prompts |
| SVG Toolkit | Stale but capable competitor; promised features absent | SVG developer workbench | SVGO, live preview, clear scope boundary |
| Brandfetch Logo Fetcher | API friction and public fallback token | In-editor brand kit | User token flow and selected-format insertion |
| MCP App Starter | Native discovery exists; day-2 commands are stubs | MCP development loop | Real code insertion and configuration diagnostics |
| Workspace Watchdog | GitLens and Todo Tree lead adjacent jobs | Copilot session health monitor | Repair git/TODO/tree view fundamentals |
| SecretGuard | Enterprise security incumbents | Lightweight AI-aware local gate | Accurate patterns, lower false positives, ignore support |
| Knowledge Decay Tracker | No direct competitor; core algorithm incomplete | Knowledge-freshness authority | Activate tags and real activity/reference scoring |
| Dev Wellbeing | Few direct ergonomic competitors | Context-aware recovery aid | Persist data, then transparent stress signals |
| Focus Timer | Fragmented commodity category | Annotated local focus tracker | Persist history, add work notes, correct category |

## Portfolio Risks

1. **Platform displacement:** Features already delivered by VS Code should be
   reframed, not replicated.
2. **Claim drift:** A repeated mismatch between marketing and source undermines
   every extension, including those with a real market opening.
3. **API and model volatility:** Replicate, Brandfetch, Logo.dev, and cloud
   speech paths require current documentation checks and user-visible failure
   states.
4. **Security overclaiming:** Secret scanning needs clear limitations,
   precision testing, and no implication that it replaces enterprise scanning.
5. **Suite sprawl:** Gamma/PPTX overlap and a shared menu namespace can turn a
   coherent portfolio into a collection of confusing near-duplicates.
6. **Privacy expectations:** Wellbeing and Watchdog features must keep data
   local by default, explain each signal, and let users reset or disable
   monitoring.

## Recommended Operating Cadence

1. Run the portfolio credibility baseline.
2. Deliver the next extension in the order in [PLAN.md](./PLAN.md).
3. Before coding, verify the competitor and platform assumptions for that
   extension.
4. Release one focused v0.2 outcome with visual evidence and a clear
   Marketplace message.
5. Measure install velocity and support feedback for 28 days before expanding
   the same extension.

## Evidence Sources

- [VS Code hooks reference](https://code.visualstudio.com/docs/agents/reference/hooks-reference)
- [VS Code MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [VS Code 1.121 Mermaid support](https://code.visualstudio.com/updates/v1_121#_mermaid-diagrams-in-markdown-preview-and-notebooks)
- [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- [jock.svg](https://marketplace.visualstudio.com/items?itemName=jock.svg)
- [Replicate MCP announcement](https://replicate.com/changelog/2026-02-10-mcp-server-auto-discovery)
- [Microsoft Speech extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-speech)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- [Snyk Security](https://marketplace.visualstudio.com/items?itemName=snyk-security.snyk-vulnerability-scanner)
- [Trivy for VS Code](https://marketplace.visualstudio.com/items?itemName=aquasecurityofficial.trivy-vulnerability-scanner)
- Local review: `extensions/*/src`, `shared/`, `README.md`, `ROADMAP.md`, and
  `TODO.md`.
