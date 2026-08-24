# Marketplace Workload Identity Plan

## Objective

Replace Marketplace publishing PATs with Azure Pipelines workload identity
federation before the next extension release.

## Current State

- A user-assigned managed identity exists for Marketplace publishing.
- Azure DevOps service connection
  `sc-extensions-marketplace-publish` is scoped to its Azure resource group.
- The service connection uses workload identity federation and is authorized
  only for the `Extensions` pipeline.
- `azure-pipelines.yml` is a manually triggered identity smoke test. It does
  not package or publish an extension.
- The first smoke-test attempts were blocked because this Azure DevOps
  organization has not connected billing and therefore has no available
  Microsoft-hosted parallel job.

## Prerequisite

Connect Azure DevOps billing without purchasing additional capacity. The
organization receives one Microsoft-hosted parallel job and 1,800 free minutes
per month. Do not add paid parallel jobs for this publishing workflow.

## Smoke Test

1. Re-run the `Extensions` pipeline after the hosted job entitlement is active.
2. Confirm that it succeeds and records the managed identity's Marketplace
   profile ID.
3. In Marketplace publisher management, add that profile ID to
   `fabioc-aloha` as a **Contributor**.
4. Re-run the smoke test to confirm the federated identity remains valid.

## Production Release Pipeline

Before the next version release:

1. Add a manually triggered release pipeline that receives an explicit
   extension filter.
2. Package the selected extensions using the repository release runner.
3. Publish with `npx @vscode/vsce publish --azure-credential`.
4. Start with one new patch version as the first live federated release.
5. Keep Marketplace PATs as an emergency fallback only until that release
   succeeds.

## Guardrails

- Never run a portfolio-wide publish without an explicit extension filter.
- Do not grant the service connection access to all pipelines.
- Do not publish an already released version.
- Tag versions only after Marketplace confirms publication.

See [PUBLISHING.md](./PUBLISHING.md) for the operating runbook.
