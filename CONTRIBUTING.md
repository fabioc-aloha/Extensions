# Contributing Guide

## Code Standards

- **TypeScript strict mode** — no `any`, no `ts-ignore` without comment explaining why
- **No AI required for core** — every extension must have a working code path with zero API keys
- **Single responsibility** — each file does one thing. `extension.ts` registers, delegates to service files
- **VS Code SecretStorage** for API keys — never `settings.json`, never `.env` files
- **Disposable pattern** — all VS Code event subscriptions pushed to `context.subscriptions`

## Extension Structure

Every extension follows this layout:
```
extensions/{name}/
├── package.json          — VS Code extension manifest
├── tsconfig.json         — Extends ../../tsconfig.base.json
├── README.md             — User-facing documentation
├── CHANGELOG.md          — Version history
├── TODO.md               — Extension-specific tasks
├── src/
│   ├── extension.ts      — activate() / deactivate() only
│   ├── commands/         — One file per command
│   ├── providers/         — TreeDataProvider, CodeLensProvider, etc.
│   ├── services/         — Business logic, API calls
│   └── utils/            — Pure functions, no VS Code dependencies
└── test/
    └── extension.test.ts
```

## Shared Utilities

Before writing a utility, check `shared/` first:
- `shared/api/replicate.ts` — Replicate image generation
- `shared/api/brandfetch.ts` — Logo fetching
- `shared/utils/decay.ts` — Forgetting Curve decay engine
- `shared/utils/secretScanner.ts` — Regex-based secret detection
- `shared/utils/fileObservations.ts` — Background file watcher logic

Import from shared: `import { DecayEngine } from '../../shared/utils/decay'`

## Adding a New Command

1. Register in `package.json` → `contributes.commands`
2. Create `src/commands/{commandName}.ts` exporting an async handler function
3. Wire in `extension.ts`: `context.subscriptions.push(vscode.commands.registerCommand('ext.commandName', handler))`

## Definition of Done (per extension)

- [ ] `npm run compile` exits 0 with zero errors
- [ ] Installed locally via `.vsix` — activates cleanly
- [ ] 3 core commands tested manually
- [ ] README has: description, install instructions, at least one screenshot or GIF
- [ ] CHANGELOG documents `v0.1.0` changes
- [ ] No hardcoded API keys or secrets
- [ ] No `console.log` in production paths (use `outputChannel.appendLine`)

## Publishing

1. Ensure a `LICENSE` file exists in the extension directory (copy from any Sprint 1 extension)
2. Ensure `.vscodeignore` exists (copy template from any Sprint 1 extension)
3. **Check for name collision** — search the extension `name` at `marketplace.visualstudio.com`. If taken by any publisher, prefix with `cx-` (e.g. `cx-focus-timer`). Update both `name` and `displayName`.
4. Add esbuild bundle scripts to `package.json` if not present:
   ```json
   "bundle": "npx esbuild src/extension.ts --bundle --outfile=out/extension.js --external:vscode --platform=node --target=node20 --format=cjs --minify",
   "package": "npm run bundle && npx @vscode/vsce package",
   "publish": "npm run bundle && npx @vscode/vsce publish"
   ```
5. Bump version in `package.json` and update `CHANGELOG.md`
6. `npm run bundle` — verify `out/extension.js` builds cleanly
7. `npx @vscode/vsce publish --no-dependencies`
8. Create git tag: `git tag {extension-name}/v{version}`

> **Rate limit**: Marketplace caps new extension creation at ~4 per 12-hour window. Plan batch publishes accordingly.

## Branching

- `main` — always deployable
- `feat/{extension-name}/{feature}` — feature branches
- PRs required for anything touching `shared/`
