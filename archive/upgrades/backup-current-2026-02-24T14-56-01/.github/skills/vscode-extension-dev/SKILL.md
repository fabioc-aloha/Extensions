---
name: "vscode-extension-dev"
description: "VS Code extension development — activation events, command registration, disposables, SecretStorage, QuickPick, Progress API"
---

# VS Code Extension Development Skill

**Trifecta**: Extension Development Mastery (1 of 3)
**Activation**: extension, activate, command, disposable, SecretStorage, QuickPick, Progress, StatusBar, settings
**Last Validated**: 2026-02-20 | VS Code 1.109

---

## Extension Lifecycle

```
activate() → register commands/listeners → push to context.subscriptions
                                                          ↓
deactivate() → dispose service → clearInterval/clearTimeout → remove listeners
```

The **golden rule**: if you create it, push it to `context.subscriptions`. VS Code calls `dispose()` on all of them at deactivation.

---

## Activation Events Reference

| Pattern | When to Use |
|---|---|
| `[]` (empty) | Default — activates on first declared command |
| `"onStartupFinished"` | Background services (file watchers, timers) |
| `"onLanguage:typescript"` | Language-specific tools |
| `"onView:viewId"` | When a custom view is opened |
| `"onUri"` | Deep link activation |
| `"*"` | AVOID — activates on every VS Code start (kills startup perf) |

---

## Command Registration

```typescript
// Single command
context.subscriptions.push(
    vscode.commands.registerCommand('extension.id.commandName', async () => {
        // handler
    })
);

// Command with args
context.subscriptions.push(
    vscode.commands.registerCommand('extension.id.openFile', async (uri: vscode.Uri) => {
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
    })
);

// Command from package.json must match exactly:
// "contributes.commands": [{ "command": "extension.id.commandName", "title": "..." }]
```

---

## SecretStorage (API Key Management)

**The only acceptable way to store API keys in extensions.**

```typescript
export class SecretsService {
    constructor(private secrets: vscode.SecretStorage) {}

    async get(key: string): Promise<string | undefined> {
        return this.secrets.get(key);
    }

    async set(key: string, value: string): Promise<void> {
        await this.secrets.store(key, value);
    }

    async delete(key: string): Promise<void> {
        await this.secrets.delete(key);
    }

    async getOrPrompt(key: string, prompt: string): Promise<string | undefined> {
        let value = await this.secrets.get(key);
        if (!value) {
            value = await vscode.window.showInputBox({ prompt, password: true, ignoreFocusOut: true });
            if (value) { await this.secrets.store(key, value); }
        }
        return value;
    }
}
```

Usage in `activate()`:
```typescript
const secretsService = new SecretsService(context.secrets);
```

---

## QuickPick (User Selection)

```typescript
// Simple string selection
const choice = await vscode.window.showQuickPick(['TypeScript', 'JavaScript', 'Python'], {
    placeHolder: 'Select language',
    ignoreFocusOut: true
});

// Rich items with detail
interface ExtensionItem extends vscode.QuickPickItem {
    extensionId: string;
}

const items: ExtensionItem[] = extensions.map(ext => ({
    label: ext.displayName,
    description: ext.version,
    detail: ext.description,
    extensionId: ext.id
}));

const picked = await vscode.window.showQuickPick<ExtensionItem>(items, {
    placeHolder: 'Select extension',
    matchOnDescription: true,
    matchOnDetail: true
});
```

---

## Progress API

```typescript
await vscode.window.withProgress(
    {
        location: vscode.ProgressLocation.Notification,
        title: 'Processing files',
        cancellable: true
    },
    async (progress, token) => {
        const files = await vscode.workspace.findFiles('**/*.ts');
        
        for (let i = 0; i < files.length; i++) {
            if (token.isCancellationRequested) { return; }
            
            progress.report({
                increment: 100 / files.length,
                message: path.basename(files[i].fsPath)
            });
            
            await processFile(files[i]);
        }
    }
);
```

---

## Input Box Pattern

```typescript
const name = await vscode.window.showInputBox({
    prompt: 'Extension name',
    placeHolder: 'my-extension',
    value: 'my-extension',
    validateInput: (value) => {
        if (!value) { return 'Name is required'; }
        if (!/^[a-z][a-z0-9-]*$/.test(value)) {
            return 'Use lowercase letters, numbers, and hyphens only';
        }
        return undefined;  // valid
    },
    ignoreFocusOut: true
});

if (!name) { return; }  // user cancelled
```

---

## File System Access

```typescript
// Read a file
const bytes = await vscode.workspace.fs.readFile(uri);
const content = Buffer.from(bytes).toString('utf8');

// Write a file
const data = Buffer.from(JSON.stringify(obj, null, 2), 'utf8');
await vscode.workspace.fs.writeFile(uri, data);

// Check if file exists
try {
    await vscode.workspace.fs.stat(uri);
    // exists
} catch {
    // does not exist
}

// List directory
const entries = await vscode.workspace.fs.readDirectory(folderUri);
// entries: [name: string, type: vscode.FileType][]
```

---

## Workspace Folders

```typescript
const workspaceFolders = vscode.workspace.workspaceFolders;
if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('Open a workspace folder first.');
    return;
}
const root = workspaceFolders[0].uri;
const configUri = vscode.Uri.joinPath(root, '.vscode', 'config.json');
```

---

## Common Gotchas

1. **Never `await` inside `activate()`** — VS Code does not await the activate return. Use `void` or a service that auto-initializes.
2. **disposables.push + clearInterval** — setInterval is not a VS Code Disposable. You must clear it manually in `dispose()`.
3. **vscode.Uri.file() vs jonPath** — always prefer `vscode.Uri.joinPath(base, 'subpath')` over string concat.
4. **`context.globalStorageUri`** — the right place for extension-persistent data (not temp, not workspace).
5. **Empty `activationEvents`** — only works if commands are declared in `contributes.commands`. If no commands, add explicit event.
