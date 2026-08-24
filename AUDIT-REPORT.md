# Extensions Portfolio: Current State and Future Vision

**Audit date:** 2026-08-24
**Scope:** 16 extension v0.2 source candidates and monorepo release tooling
**Publication status:** All 16 extensions published at v0.2.0 on 2026-08-24

## Current State

The end-to-end audit compared each extension's manifest, README, CHANGELOG,
source, dependencies, and packaged VSIX behavior against this report and
`MARKET-ANALYSIS-AND-OPPORTUNITIES.md`.

Confirmed defects were corrected in the working tree:

- Shell-string invocation was removed from Pandoc and Marp executable checks.
- PowerShell speech values now cross the process boundary through environment
  variables rather than generated command text.
- Mermaid and SVG webview trust boundaries were hardened.
- Replicate generation and downloads are cancellable.
- Hook Studio now has current-layout validation, migration, recipes, and a
  static lifecycle-event dry run.
- MCP App Starter inserts real starter snippets, validates local configuration,
  registers workspace servers, and uses the current Python SDK 2.0 scaffold.
- SVG to PNG now stages the cross-platform WASM renderer instead of a
  build-host-specific native binary.
- Dev Wellbeing persists and can reset its minimal local session baseline.
- Retired Marketplace Shields endpoints were removed from every README.
- The npm workspace lockfile and direct release dependencies were refreshed.

## Measured Validation

| Gate | Result |
|---|---|
| TypeScript compile for shared + 16 extensions | Passed |
| Per-extension package script | Passed - 16/16 v0.2 VSIX artifacts produced |
| Runtime dependency inclusion | Verified by VSIX inspection for bundled packages |
| PPTX dependency | Bundled into `out/extension.js`; no external runtime require |
| Marketplace publication | Passed - all 16 v0.2.0 extensions published |
| Git tags | One v0.2.0 tag created per successfully published extension |

## Dependency Audit

`pptxgenjs` currently depends on `image-size`, whose npm advisory applies to
formats not consumed by the v0.2 text-only PPTX workflow. The dependency is
overridden to the latest available `image-size` release, but npm still reports
the upstream advisory because no non-vulnerable release is currently
recognized. This is a documented residual risk, not silently treated as clean.

The remaining npm audit findings are in development/release tooling. They are
not bundled into extension runtime artifacts. Upgrade them as fixed upstream
versions become available.

Every extension manifest is versioned `0.2.0`; that version identifies a source
candidate, not a published Marketplace release.

| Portfolio area | Current v0.2 baseline |
|---|---|
| Document and presentation | Folder DOCX conversion, native preview, themed PPTX output, and hybrid local/Gamma presentation generation |
| Visual asset workflows | Icon-set export, cross-platform SVG rendering, safe live preview, colors, Mermaid compatibility, and local export |
| Developer workflows | Current Copilot hook validation, MCP workspace registration, local secret scanning, Git/TODO health signals |
| Local productivity | Persistent focus sessions, transparent reminder data, and knowledge freshness scoring |
| Reliability and safety | Safe process boundaries, webview isolation, cancellable generations, SecretStorage credentials, package safeguards |

## Future Vision

The next release cycle should expand only after v0.2 smoke testing and
Marketplace feedback establish which workflows create durable value.

| Focus | Future direction | Boundary |
|---|---|---|
| Evidence-first content | Word-like DOCX preview, richer PPTX visual composition, and post-export review | Do not add cloud conversion without a clear user benefit |
| Visual production | Offline Mermaid export, SVG optimization, brand palettes, and controlled asset pipelines | Keep SVG Toolkit authoring separate from SVG to PNG rasterization |
| Agent safety | Form-based hook authoring, MCP Inspector support, pre-commit secret controls, and agent-session health | Treat native VS Code capabilities as baseline, not competition to clone |
| Durable local work | Replicate gallery, decay dashboard, focus streaks, and optional wellbeing coordination | Preserve local-only state and explicit reset controls |
| Marketplace learning | Workflow screenshots, release notes, and 28-day adoption/support review | Publish a measured batch; do not release all extensions blindly |

`MARKET-ANALYSIS-AND-OPPORTUNITIES.md` preserves the competitive evidence,
install snapshot, and research ledger that informs these choices.

## Post-Publication Follow-Through

1. Perform targeted Marketplace-install smoke tests from `TEST-GUIDE.md`.
2. Capture current workflow evidence for Marketplace pages where a screenshot
   materially improves comprehension.
3. Monitor Marketplace rendering, acquisition, and support feedback for 28
   days before selecting the next post-v0.2 investment.

## Publication Pilot

SVG Toolkit v0.2.0 was published on 2026-08-24 through the Marketplace API
with an organization-scoped Marketplace (Manage) PAT. Marketplace management
reflected the version in approximately six minutes. The pilot credential was
revoked after publication and the source was tagged `svg-toolkit/v0.2.0`.

The remaining 15 extensions were then published through the same
organization-scoped, short-lived PAT flow. That batch credential was revoked
immediately after publication, and each extension received its own v0.2.0
source tag.

## Residual Risks and Non-Defects

- Top-level `await` in the generated JavaScript MCP template is valid because
  the generated project declares `"type": "module"`.
- `pptxgenjs` is bundled by esbuild; the VSIX does not need a separate
  `node_modules/pptxgenjs` directory.
- Focus Timer intentionally persists completed sessions only; stopped partial
  sessions are not represented as completed work.
