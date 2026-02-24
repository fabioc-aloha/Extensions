---
name: "extension-security"
description: "Security for VS Code extensions — SecretStorage, no hardcoded credentials, vsce ls verification, secret scanning"
---

# Extension Security Skill

**Trifecta**: Monorepo & Architecture (3 of 3)
**Activation**: security, secret, API key, credential, SecretStorage, hardcoded, scan, vsce ls, .vscodeignore
**Last Validated**: 2026-02-20

---

## The Extension Security Contract

Every extension in this monorepo makes this promise to users:
1. **No hardcoded API keys** — all credentials via VS Code SecretStorage
2. **No secrets in the .vsix** — vsce ls verified before every publish
3. **No credentials in settings.json** — settings are visible and synced; secrets are not

Break these rules = never publish that extension.

---

## What SecretStorage Is (and Is Not)

| Storage | Where | Visible To | Use For |
|---|---|---|---|
| `context.secrets` | OS keychain / VS Code encrypted store | Only your extension | API keys, tokens, passwords |
| `context.globalState` | VS Code storage | Extension itself | Non-sensitive preferences |
| `vscode.workspace.getConfiguration()` | settings.json | User, sync, logs | Non-sensitive settings |
| `process.env` | Environment | All processes | CI/CD only, never shipped |

**Rule**: If it's a secret → `context.secrets`. No exceptions.

---

## SecretStorage Patterns

```typescript
// Storing
await context.secrets.store('myExt.replicateApiKey', userInput);

// Retrieving
const key = await context.secrets.get('myExt.replicateApiKey');

// Deleting
await context.secrets.delete('myExt.replicateApiKey');

// Watch for external changes (e.g., user deletes via Settings UI)
context.subscriptions.push(
    context.secrets.onDidChange(e => {
        if (e.key === 'myExt.replicateApiKey') {
            // key was changed/deleted externally
            this.invalidateCache();
        }
    })
);
```

**Never** do this:
```typescript
// ❌ WRONG — readable in settings.json, synced to the cloud
vscode.workspace.getConfiguration('myExt').update('apiKey', userInput, true);

// ❌ WRONG — hardcoded in source
const apiKey = 'sk-proj-abc123...';

// ❌ WRONG — read from .env (might be committed)
const apiKey = process.env.REPLICATE_API_KEY;
```

---

## SecretScanner (from shared/utils/secretScanner.ts)

Used by Secret Guard extension. The patterns it scans for:

```typescript
// High-severity patterns
const HIGH_SEVERITY_PATTERNS = [
    /sk-[a-zA-Z0-9]{20,}/,                    // OpenAI API key
    /r8_[a-zA-Z0-9]{20,}/,                     // Replicate API key
    /AKIA[0-9A-Z]{16}/,                         // AWS access key
    /eyJ[a-zA-Z0-9]{40,}/,                      // JWT token
    /ghp_[a-zA-Z0-9]{36}/,                      // GitHub PAT
];

// Medium-severity (generic but suspicious)
const MEDIUM_SEVERITY_PATTERNS = [
    /api[_-]?key\s*=\s*['"][a-zA-Z0-9]{16,}['"]/i,
    /token\s*=\s*['"][a-zA-Z0-9]{16,}['"]/i,
    /password\s*=\s*['"][^'"]{8,}['"]/i,
];
```

The scanner runs on save in Secret Guard, creating VS Code diagnostics.

---

## vsce ls — The Pre-Publish Gate

**Run this before every publish, no exceptions**:

```powershell
cd extensions/hook-studio
npx vsce ls
```

Expected output (what should be in the .vsix):
```
dist/extension.js
dist/extension.js.map
package.json
README.md
CHANGELOG.md
LICENSE
assets/icon.png
```

**Red flags — abort if you see**:
```
src/extension.ts          ← source code shouldn't ship
.env                      ← environment file
secrets.json              ← obvious
*.key, *.pem              ← certificate/key files
node_modules/.../         ← should be in .vscodeignore or bundled
.github/                  ← CI config
```

---

## .vscodeignore Best Practice

```
# Development files — never ship
.vscode/**
.vscode-test/**
src/**
test/**
out/test/**

# CI and scripts
.github/**
scripts/**

# TypeScript source (ship only dist/)
*.ts
!dist/**/*.d.ts
tsconfig*.json

# Dev tooling
.eslintrc*
.prettierrc*
jest.config.js
*.config.ts

# Debug files
*.map

# Package artifacts
*.vsix

# Always exclude node_modules (unless bundled via bundledDependencies)
node_modules/**
```

---

## Credential Safety in Extension Development

**When testing extension that needs an API key**:
1. Use VS Code SecretStorage (run extension in Extension Development Host, enter key once)
2. OR use workspace settings (for non-sensitive test values only)

**When adding a new API-dependent extension**:
1. Add `ensureApiKey()` pattern in extension.ts (prompts user, stores in SecretStorage)
2. Document the API key requirement in README, under "Requirements"
3. Add "No API key required for core features" note if applicable — maximize 0-key usability

---

## Security Audit for Extensions

Before tagging a release:

```powershell
# 1. Check for hardcoded secrets in src/
rg -r "(api[_-]?key|token|secret|password)\s*=\s*['\"]" extensions/my-extension/src/

# 2. Check .vscodeignore exists
Test-Path extensions/my-extension/.vscodeignore

# 3. Run vsce ls and inspect
cd extensions/my-extension
npx vsce ls | Select-String -Pattern "\.env|\.key|src/"

# 4. Check package.json for no secrets in config fields
cat extensions/my-extension/package.json | ConvertFrom-Json | Select-Object -Property contributes
```

---

## hooks.json Security Check

(Relevant for Hook Studio specifically)

When saving hooks.json, validate:
1. `command` field must start with `node` or `python` — no `rm -rf`, no shell injection
2. Working directory must be within the workspace
3. Environment variables passed to hooks should not include API keys from VS Code SecretStorage

```typescript
// In HookStudioPanel — validate before saving
function validateHookCommand(command: string): boolean {
    const allowedCommands = ['node', 'python', 'python3', 'deno'];
    const firstWord = command.trim().split(' ')[0];
    return allowedCommands.includes(firstWord);
}
```
