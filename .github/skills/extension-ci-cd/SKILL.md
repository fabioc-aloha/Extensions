---
name: "extension-ci-cd"
description: "GitHub Actions for VS Code extensions — matrix builds, artifact upload, automated publish workflow"
---

# Extension CI/CD Skill

**Trifecta**: Publishing & Release (3 of 3)
**Activation**: GitHub Actions, CI, build.yml, publish.yml, matrix, artifact, workflow, vsce CI
**Last Validated**: 2026-02-20

---

## Build Workflow Reference

The monorepo has `.github/workflows/build.yml`:

```yaml
name: Build All Extensions

on:
  push:
    branches: [main, 'feature/**']
  pull_request:
    branches: [main]

jobs:
  build:
    strategy:
      matrix:
        extension:
          - hook-studio
          - workspace-watchdog
          - mcp-app-starter
          # ... all 15 extensions
    
    runs-on: ubuntu-latest
    name: Build ${{ matrix.extension }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Compile ${{ matrix.extension }}
        run: npm run compile -w extensions/${{ matrix.extension }}
      
      - name: Run tests
        run: npm test -w extensions/${{ matrix.extension }}
        env:
          DISPLAY: ':99.0'  # needed for @vscode/test-electron on Linux
      
      - name: Package .vsix
        run: |
          cd extensions/${{ matrix.extension }}
          npx vsce package
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.extension }}-vsix
          path: extensions/${{ matrix.extension }}/*.vsix
          retention-days: 14
```

---

## Publish Workflow Reference

`.github/workflows/publish.yml` is manual-dispatch only:

```yaml
name: Publish Extension

on:
  workflow_dispatch:
    inputs:
      extension:
        description: 'Extension to publish'
        required: true
        type: choice
        options:
          - hook-studio
          - workspace-watchdog
          - mcp-app-starter
          # ...
      preRelease:
        description: 'Publish as pre-release?'
        required: true
        type: boolean
        default: false

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Compile
        run: npm run compile -w extensions/${{ inputs.extension }}
      
      - name: Verify package contents (catch accidental secrets)
        run: |
          cd extensions/${{ inputs.extension }}
          npx vsce ls
      
      - name: Publish to marketplace
        run: |
          cd extensions/${{ inputs.extension }}
          if [ "${{ inputs.preRelease }}" = "true" ]; then
            npx vsce publish --pre-release --pat $VSCE_PAT
          else
            npx vsce publish --pat $VSCE_PAT
          fi
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
```

---

## GitHub Actions Secret Setup

1. GitHub repo → Settings → Secrets and variables → Actions
2. New repository secret: `VSCE_PAT` → paste your PAT
3. Rotate before expiry — add a reminder in your calendar

**The secret is referenced in workflow as `${{ secrets.VSCE_PAT }}`**. Never `echo` it.

---

## xvfb for Integration Tests in CI

`@vscode/test-electron` downloads and launches VS Code. On Linux CI runners, requires a virtual display:

```yaml
- name: Install xvfb (Linux only)
  if: runner.os == 'Linux'
  run: |
    sudo apt-get install -y xvfb
    Xvfb :99 -screen 0 1024x768x24 &

- name: Run tests
  run: npm test -w extensions/${{ matrix.extension }}
  env:
    DISPLAY: ':99.0'
```

**Alternative**: Use `@vscode/test-cli` with headless mode (newer, still stabilizing in 1.109).

---

## Branch Strategy

```
main        — protected, CI required, source of truth for publishing
feature/X   — development branches (build CI runs, no publish)
release/X   — optional: staging branch before main merge
```

**Conventional commits** (not enforced, but helps CHANGELOG generation):
```
feat(hook-studio): add runner tab
fix(workspace-watchdog): handle undefined workspace root
chore(deps): bump @vscode/test-electron to 2.4.1
```

---

## Artifact Download for Local Testing

After a build workflow run:
1. GitHub Actions → the run → Artifacts section
2. Download `hook-studio-vsix`
3. `code --install-extension hook-studio-0.1.0.vsix`
4. Reload VS Code and smoke test

---

## Adding a New Extension to CI

When adding `my-extension` to the monorepo:

1. Add to `build.yml` matrix:
   ```yaml
   - my-extension
   ```

2. Add to `publish.yml` workflow_dispatch options:
   ```yaml
   options:
     - my-extension
   ```

3. Ensure extension has valid `package.json`, `tsconfig.json`, and `npm run compile` script.

---

## Caching Strategy

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: package-lock.json
```

`package-lock.json` at monorepo root locks all workspace dependencies. This keeps the cache effective across all 15 extensions.
