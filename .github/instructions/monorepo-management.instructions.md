# Monorepo Management Instructions

**applyTo**: `package.json`, `tsconfig*.json`, `shared/**`

---

## npm Workspaces Structure

This repo uses npm workspaces. The root `package.json` declares:

```json
{
  "workspaces": [
    "extensions/*",
    "shared"
  ]
}
```

**Key behaviors**:
- `npm install` at root installs all workspace dependencies
- `node_modules/` is hoisted to root where possible
- `npm run compile -w extensions/hook-studio` — run a script in one workspace
- `npm run compile --workspaces` — run in all workspaces

---

## TypeScript Inheritance via tsconfig

Root `tsconfig.base.json`:
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
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true
  },
  "exclude": ["node_modules", "dist"]
}
```

Each extension's `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

---

## Shared Utilities Usage

Before writing any utility, check `shared/`:

```typescript
// ✅ CORRECT — import from shared
import { DecayEngine } from '../../shared/utils/decay';
import { SecretScanner } from '../../shared/utils/secretScanner';
import { FileObservationStore } from '../../shared/utils/fileObservations';
import { ReplicateClient } from '../../shared/api/replicate';
import { BrandfetchClient } from '../../shared/api/brandfetch';

// ❌ WRONG — duplicating DecayEngine in a second extension
```

**Adding a new shared utility**:
1. Create `shared/utils/yourUtil.ts` or `shared/api/yourClient.ts`
2. Export from `shared/index.ts`
3. Update the shared utilities table in `.github/copilot-instructions.md`
4. Document extraction source in the utility's JSDoc

---

## Extension Dependency on vscode

Each extension's `package.json`:
```json
{
  "peerDependencies": {
    "vscode": "^1.109.0"
  },
  "devDependencies": {
    "@types/vscode": "^1.109.0",
    "@vscode/test-electron": "^2.4.0",
    "typescript": "^5.3.0"
  }
}
```

**Rule**: `vscode` is always a `peerDependency`. Never a `dependency` or `devDependency`.

---

## Adding a New Extension to the Monorepo

1. Create folder: `extensions/my-extension/`
2. Create `package.json` (copy from `templates/basic-extension/`)
3. Create `src/extension.ts`
4. Create `tsconfig.json` (extends `../../tsconfig.base.json`)
5. Create `README.md` and `CHANGELOG.md`
6. The root npm workspaces automatically picks it up on next `npm install`
7. Add to the extension inventory table in `.github/copilot-instructions.md`
8. Add to `.github/workflows/build.yml` matrix
9. Add entry to root `TODO.md`

---

## Build All Extensions

```powershell
# From monorepo root
node scripts/package-all.js     # packages all 15 extensions to .vsix

# Or NPM workspaces style
npm run compile --workspaces --if-present

# Clean all dist/ and out/ folders
node scripts/clean-all.js
```

---

## Workspace-Aware VS Code Settings

`.vscode/settings.json` at monorepo root:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## When a Shared Utility Changes

If you modify `shared/utils/decay.ts`:
1. Check all extensions that import it: `grep -r "from '../../shared/utils/decay'" extensions/`
2. Verify they still compile: `npm run compile -w extensions/knowledge-decay-tracker`
3. If the interface changed (breaking), update all importers
4. Run full build: `npm run compile --workspaces --if-present`

---

## Common Root-Cause: Compilation Errors

Most common failures:
1. **`Cannot find module '../../shared/utils/decay'`** — run `npm install` at root to link workspaces
2. **`Property X does not exist on type Y`** — shared utility interface changed; update call sites
3. **`'vscode' has no exported member X`** — VS Code API version mismatch; check `@types/vscode` version
4. **`strict null check`** — result may be undefined; add null guard

Quick fix pattern:
```powershell
cd extensions/broken-extension
npm install
npm run compile
# Read the first error only — fix it before reading the rest
```
