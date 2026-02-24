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

1. Bump version in `package.json` and `CHANGELOG.md`
2. `npm run compile`
3. `npx vsce package` → installs locally, verifies
4. `npx vsce publish` (requires PAT in env: `VSCE_PAT`)
5. Create git tag: `git tag {extension-name}/v{version}`

## Branching

- `main` — always deployable
- `feat/{extension-name}/{feature}` — feature branches
- PRs required for anything touching `shared/`
