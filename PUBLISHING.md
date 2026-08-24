# Publishing Extensions

## Purpose

This is the canonical release runbook for the `fabioc-aloha` VS Code
Marketplace publisher. It defines a repeatable, API-based process for
publishing selected extension versions without relying on browser automation.

## Release Principles

1. Publish an **explicit batch**, never an unreviewed portfolio-wide update.
2. Publish only a version that has passed its local VSIX smoke test.
3. Use direct Marketplace API authentication. A Marketplace browser session is
   not an API credential.
4. Treat an existing Marketplace version as an error. Do not silently skip it.
5. Tag only versions confirmed as published.

## Prerequisites

- Node.js 20+
- Repository dependencies installed:
  ```powershell
  npm install
  ```
- An account authorized to publish under `fabioc-aloha`
- A clean source tree for the intended release commit
- Version, README, CHANGELOG, and package metadata updated for every selected
  extension

## Authentication

### Preferred: Microsoft Entra API authentication

The preferred command uses `@vscode/vsce --azure-credential`, which publishes
through Marketplace APIs using an available Microsoft Entra credential:

```powershell
npm run publish:all:entra -- --filter=hook-studio
```

This does not use browser automation and does not reuse a Marketplace browser
cookie. If no authorized Entra credential is available locally, authenticate
the approved account through the organization’s standard Entra sign-in method,
then rerun the command.

### Fallback: Marketplace PAT

Use a Marketplace PAT only when Entra authentication is unavailable:

```powershell
$env:VSCE_PAT = "<token>"
npm run publish:all -- --filter=hook-studio
```

The PAT must have Marketplace publisher-management permission. Keep it out of
source, shell history, documentation examples, and committed scripts.

## Standard Release Flow

Replace the example filter with the exact release set.

### 1. Confirm the release commit

```powershell
git status --short
git log -1 --oneline
```

The intended source changes should already be committed and mirrored to Azure
DevOps and GitHub before publishing.

### 2. Run the full build and package gate

```powershell
npm run compile:all
npm run package:all
```

Generated `.vsix` files are disposable artifacts. They are ignored by Git and
should be rebuilt from the intended release commit.

### 3. Perform targeted local smoke tests

Install each selected VSIX and follow the matching workflow in
[`TEST-GUIDE.md`](./TEST-GUIDE.md):

```powershell
code --install-extension extensions\hook-studio\hook-studio-0.2.0.vsix --force
```

Reload VS Code after installation. Verify the extension’s core commands,
requirements boundary, local storage behavior, and error states before
publishing.

### 4. Preview the publication request

No VSIX files are uploaded during a dry run:

```powershell
npm run publish:all:entra -- --dry-run --filter=hook-studio,svg-to-png
```

Confirm that:

- only the intended extension directories are selected;
- each manifest version is the expected version;
- each displayed VSIX path is the newly built artifact;
- the command includes `--azure-credential`.

### 5. Publish the explicit batch

```powershell
npm run publish:all:entra -- --filter=hook-studio,svg-to-png
```

The runner packages **all selected extensions before publishing any of them**.
If packaging fails, nothing is uploaded. A duplicate Marketplace version fails
visibly rather than being skipped.

### 6. Verify the Marketplace result

For every published extension:

1. Open its Marketplace listing.
2. Confirm the version, icon, banner, README, dependency badges, and
   requirements are rendered correctly.
3. Install the Marketplace version into a clean VS Code profile or equivalent
   validation environment.
4. Record any Marketplace-specific issue before publishing the next batch.

## Tags

Create a tag only after the matching Marketplace version is confirmed:

```powershell
git tag hook-studio/v0.2.0
git push origin --tags
git push github-backup --tags
```

Do not tag unpublished or failed versions.

## Batch Strategy

Start with a small, high-confidence batch. The current priority evidence is in
[`MARKET-ANALYSIS-AND-OPPORTUNITIES.md`](./MARKET-ANALYSIS-AND-OPPORTUNITIES.md).

Recommended first batch:

```text
markdown-to-word,svg-to-png,ai-voice-reader,pptx-builder
```

After Marketplace verification, proceed with the next explicit batch. Do not
publish all 16 simultaneously unless every local smoke test is complete and
the release owner explicitly chooses a portfolio-wide release.

## Failure Handling

| Failure | Response |
|---|---|
| Entra credential unavailable | Authenticate the authorized publisher account, then retry the same dry run |
| Duplicate version | Stop; reconcile the Marketplace listing, source version, and release tag |
| Package failure | Fix the package error; rerun the full selected batch |
| Marketplace rendering issue | Do not continue the batch; fix source, bump version, rebuild, and retest |
| Runtime issue after publication | Publish a corrective version; Marketplace versions are immutable |

## Cleanup

After release verification, remove generated artifacts:

```powershell
npm run clean:all
```

This removes `out/` folders and local `.vsix` files. Rebuild them from source
for the next smoke-test or publication run.
