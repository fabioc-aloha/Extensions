---
name: "extension-testing"
description: "VS Code extension testing — @vscode/test-electron, mocha, API stubs, integration test patterns"
---

# Extension Testing Skill

**Trifecta**: Extension Development Mastery (3 of 3)
**Activation**: test, mocha, @vscode/test-electron, stub, mock, integration test, unit test, runTests
**Last Validated**: 2026-02-20 | VS Code 1.109

---

## Test Architecture for Extensions

Extensions have two test levels:

| Level | Tool | What it Tests |
|---|---|---|
| Unit | mocha directly | Pure TypeScript logic (DecayEngine, SecretScanner, etc.) |
| Integration | @vscode/test-electron | Commands, VS Code API interaction, extension activation |

**Rule**: Shared utilities in `shared/` get unit tests. Commands and panels get integration tests.

---

## Project Setup

```json
// package.json devDependencies
{
  "@types/mocha": "^10.0.0",
  "@vscode/test-electron": "^2.4.0",
  "mocha": "^10.0.0"
}
```

```json
// package.json scripts
{
  "test": "node ./out/test/runTests.js",
  "pretest": "npm run compile"
}
```

---

## Test Runner Script

`src/test/runTests.ts`:
```typescript
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    await runTests({
        extensionDevelopmentPath,
        extensionTestsPath,
        launchArgs: ['--disable-extensions']  // isolate from other installed extensions
    });
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
```

---

## Test Suite Index

`src/test/suite/index.ts`:
```typescript
import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
    const mocha = new Mocha({ ui: 'bdd', color: true, timeout: 60_000 });
    const testsRoot = path.resolve(__dirname, '.');

    return new Promise((resolve, reject) => {
        glob('**/*.test.js', { cwd: testsRoot }).then(files => {
            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
            mocha.run(failures => {
                if (failures > 0) { reject(new Error(`${failures} test(s) failed`)); }
                else { resolve(); }
            });
        }).catch(reject);
    });
}
```

---

## Unit Test Pattern (Shared Utilities)

`test/utils/decay.test.ts`:
```typescript
import * as assert from 'assert';
import { DecayEngine } from '../../shared/utils/decay';

suite('DecayEngine', () => {
    let engine: DecayEngine;

    setup(() => {
        engine = new DecayEngine();
    });

    test('score() returns 1.0 for freshly touched item', () => {
        engine.touch('file.ts');
        const score = engine.score('file.ts');
        assert.strictEqual(score, 1.0);
    });

    test('tier() returns "stale" after 14 days', () => {
        // Manually set a stale timestamp
        engine.setTimestamp('file.ts', Date.now() - 14 * 24 * 60 * 60 * 1000);
        assert.strictEqual(engine.tier('file.ts'), 'stale');
    });

    test('filterByTier() returns only matching items', () => {
        engine.touch('fresh.ts');
        engine.setTimestamp('stale.ts', Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const fresh = engine.filterByTier(['fresh.ts', 'stale.ts'], 'fresh');
        assert.deepStrictEqual(fresh, ['fresh.ts']);
    });
});
```

---

## Integration Test Pattern (Commands)

`test/suite/extension.test.ts`:
```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Integration', () => {
    test('Extension activates successfully', async () => {
        const ext = vscode.extensions.getExtension('fabioc-aloha.hook-studio');
        assert.ok(ext, 'Extension should be found');
        await ext!.activate();
        assert.ok(ext!.isActive, 'Extension should be active');
    });

    test('Command is registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('hookStudio.open'),
            'hookStudio.open command should be registered'
        );
    });

    test('Execute command does not throw', async () => {
        await vscode.commands.executeCommand('hookStudio.open');
        // If no throw, pass
    });
});
```

---

## Mocking VS Code APIs (Unit Tests Only)

When testing pure service logic that calls VS Code APIs:

```typescript
// Create a minimal mock
const mockOutputChannel: Partial<vscode.OutputChannel> = {
    appendLine: () => {},
    show: () => {},
    dispose: () => {}
};

const mockSecrets: Partial<vscode.SecretStorage> = {
    get: async (key: string) => testSecrets[key],
    store: async (key: string, value: string) => { testSecrets[key] = value; },
    delete: async (key: string) => { delete testSecrets[key]; },
    onDidChange: new vscode.EventEmitter<vscode.SecretStorageChangeEvent>().event
};

// Use in test
const service = new MyService(
    mockOutputChannel as vscode.OutputChannel,
    mockSecrets as vscode.SecretStorage
);
```

---

## Testing Secret Guard Scan Logic

```typescript
suite('SecretScanner', () => {
    test('detects hardcoded API key pattern', () => {
        const scanner = new SecretScanner();
        const code = `const key = "replicate_api_key_abc123xyz456";`;
        
        const results = scanner.scan(code);
        
        assert.ok(results.length > 0, 'Should detect the API key');
        assert.strictEqual(results[0].type, 'generic-api-key');
    });

    test('does not flag process.env reference', () => {
        const scanner = new SecretScanner();
        const code = `const key = process.env.REPLICATE_API_KEY;`;
        
        const results = scanner.scan(code);
        assert.strictEqual(results.length, 0, 'env var reference is not a secret');
    });
});
```

---

## CI Test Configuration

`.github/workflows/build.yml` already runs tests. For local:

```powershell
# From extension folder
npm test

# From monorepo root — runs all extension tests
npm test --workspaces --if-present
```

**Note**: Integration tests require a display server. In CI, Xvfb is configured automatically by `@vscode/test-electron`. Locally on Windows, they run in the desktop VS Code instance.

---

## Test File Naming Convention

```
src/
  services/
    myService.ts
  commands/
    myCommand.ts
test/
  services/
    myService.test.ts     ← mirrors src/ structure
  commands/
    myCommand.test.ts
  suite/
    index.ts              ← test runner
    extension.test.ts     ← integration tests
runTests.ts               ← electron test runner entry
```
