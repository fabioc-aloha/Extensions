---
name: "extension-monorepo"
description: "npm workspaces monorepo for 15 VS Code extensions — shared utilities, tsconfig inheritance, workspace commands"
---

# Extension Monorepo Skill

**Trifecta**: Monorepo & Architecture (1 of 3)
**Activation**: monorepo, workspaces, npm workspaces, shared, tsconfig, package.json root, all extensions
**Last Validated**: 2026-02-20

---

## Monorepo Structure

```
Extensions/                          ← root (npm workspaces root)
├── package.json                     ← declares workspaces: ["extensions/*", "shared"]
├── tsconfig.base.json               ← shared TS config all extensions extend
├── extensions/
│   ├── hook-studio/
│   │   ├── package.json             ← name: "hook-studio", publisher: "fabioc-aloha"
│   │   ├── tsconfig.json            ← extends: "../../tsconfig.base.json"
│   │   └── src/extension.ts
│   ├── workspace-watchdog/
│   └── ... (13 more)
├── shared/
│   ├── package.json                 ← name: "extensions-shared", private: true
│   ├── utils/
│   │   ├── decay.ts
│   │   ├── secretScanner.ts
│   │   └── fileObservations.ts
│   └── api/
│       ├── replicate.ts
│       └── brandfetch.ts
├── templates/
│   ├── basic-extension/
│   └── webview-extension/
├── scripts/
│   ├── package-all.js
│   └── clean-all.js
└── .github/
    └── workflows/
```

---

## Root package.json

```json
{
  "name": "vs-extensions-monorepo",
  "private": true,
  "workspaces": ["extensions/*", "shared"],
  "scripts": {
    "compile": "npm run compile --workspaces --if-present",
    "test": "npm test --workspaces --if-present",
    "package-all": "node scripts/package-all.js",
    "clean": "node scripts/clean-all.js"
  }
}
```

---

## Extension's package.json (Dependency on shared)

```json
{
  "name": "workspace-watchdog",
  "dependencies": {
    "extensions-shared": "*"    ← wildcard resolves to local workspace
  }
}
```

Then import:
```typescript
import { FileObservationStore } from 'extensions-shared/utils/fileObservations';
// OR with relative path (also works):
import { FileObservationStore } from '../../shared/utils/fileObservations';
```

---

## Per-Extension npm Commands

```powershell
# Compile one extension
npm run compile -w extensions/hook-studio

# Run tests for one extension
npm test -w extensions/workspace-watchdog

# Package one extension
cd extensions/hook-studio && npx vsce package

# Install deps for one extension
npm install some-package -w extensions/hook-studio
```

---

## tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  },
  "exclude": ["node_modules", "dist", "out", "*.vsix"]
}
```

Each extension's `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

---

## Shared Utilities Reference

| Export | File | Extracted From |
|---|---|---|
| `DecayEngine` | `shared/utils/decay.ts` | Alex Forgetting Curve v5.9.6 |
| `SecretScanner` | `shared/utils/secretScanner.ts` | Alex Secrets Management v5.8.4 |
| `FileObservationStore` | `shared/utils/fileObservations.ts` | Alex Background File Watcher v5.9.8 |
| `ReplicateClient` | `shared/api/replicate.ts` | Alex ADR-007 |
| `BrandfetchClient` | `shared/api/brandfetch.ts` | Alex Brandfetch client |

**Adding a new shared utility**:
1. Create file in `shared/utils/` or `shared/api/`
2. Export the class/function
3. Update table above and the table in `.github/copilot-instructions.md`
4. Document the source in JSDoc: `@source Alex v5.9.x — YourSkill`

---

## Dependency Hoisting

npm workspaces hoists compatible deps to root `node_modules/`:
- `@types/vscode` — hoisted (all extensions use same version)
- `typescript` — hoisted
- Extension-specific deps (e.g., `pptxgenjs` for pptx-builder) — stay in the extension's `node_modules/`

**Problem**: VSCE packages each extension's own `node_modules/`. If the extension has a `dependency` (not `devDependency`) that's hoisted, it may not be included in the `.vsix`.

**Solution**: For runtime deps, use `bundledDependencies` in package.json or bundle with esbuild:
```json
{
  "bundledDependencies": ["pptxgenjs"]
}
```

---

## Template Usage

When creating a new extension, start from a template:
```powershell
# Copy template
Copy-Item -Recurse templates/basic-extension extensions/my-extension

# Rename fields in package.json, update extension.ts, README.md
# Run npm install to link workspace
npm install
```
