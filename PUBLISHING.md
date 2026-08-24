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

### Recommended: Azure Pipelines workload identity federation

Microsoft recommends Microsoft Entra ID–based authentication with **workload
identity federation** and a **user-assigned managed identity** for automated
Marketplace publishing. This eliminates stored PATs and provides a
pipeline-scoped, short-lived credential.

Set up the publishing identity once:

1. Create a user-assigned managed identity in Azure.
2. In Azure DevOps, create an Azure Resource Manager service connection using
   **Managed identity** with **Workload Identity Federation**. Scope it to the
   resource group that hosts the identity and do not grant all pipelines access.
3. Verify that Azure DevOps created a federated credential on the managed
   identity with the connection's issuer and subject.
4. Commit the identity-smoke pipeline and explicitly authorize its use of the
   service connection.
5. Run the smoke pipeline to retrieve the identity's Marketplace profile ID:
   ```powershell
   az rest -u https://app.vssps.visualstudio.com/_apis/profile/profiles/me --resource 499b84ac-1321-427f-aa17-267ca6975798
   ```
6. In Visual Studio Marketplace publisher management, add the returned `id` as
   a publisher **Contributor**.
7. Run the pipeline through an Azure CLI task and publish with:
   ```powershell
   npx @vscode/vsce publish --azure-credential
   ```

The managed identity must be an authorized Marketplace publisher member. A
personal Entra sign-in or Marketplace browser session alone is not sufficient
for certificate-managed extension updates.

### Local direct Entra publishing

`publish:all:entra` remains useful for an authorized Entra credential:

```powershell
npm run publish:all:entra -- --filter=hook-studio
```

It uses Marketplace APIs and does not use browser automation. It is not the
recommended automation model because personal identity and extension-certificate
permissions can differ.

### Emergency fallback: Marketplace PAT

Use a Marketplace PAT only when workload identity federation is unavailable:

```powershell
$env:VSCE_PAT = "<token>"
npm run publish:all -- --filter=hook-studio
```

The PAT must have Marketplace publisher-management permission. Keep it out of
source, shell history, documentation examples, and committed scripts.

> **PAT scope change:** Azure DevOps warns that, beginning December 1, 2026,
> global PATs scoped to all accessible organizations will no longer be
> supported. Create PATs scoped to `fabioc-aloha` only.

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

For production release automation, run the equivalent command in the approved
Azure Pipeline workload identity rather than from an interactive workstation.

## Pilot Evidence

On 2026-08-24, `fabioc-aloha.svg-toolkit` v0.2.0 was published successfully
with an organization-scoped Marketplace (Manage) PAT. Marketplace management
showed the new version in approximately six minutes. The pilot PAT was revoked
immediately after publication, and the release was tagged
`svg-toolkit/v0.2.0`.

The remaining 15 v0.2.0 extensions were subsequently published through the
same short-lived, organization-scoped PAT process. That batch PAT was revoked
immediately after use, and all 16 extensions now have matching v0.2.0 tags.

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
