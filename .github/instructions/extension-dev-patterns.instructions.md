# Extension Development Patterns

**applyTo**: `extensions/**/*.ts`, `shared/**/*.ts`

---

## Activation Events

**Prefer lazy activation** — only activate when your extension's commands are first invoked.

```json
// package.json — good: specific command activation
"activationEvents": []

// VS Code 1.100+: empty array = activates on first command use (declared in contributes.commands)
// For background extensions (file watchers), use:
"activationEvents": ["onStartupFinished"]
```

**Pattern for background extensions** (Workspace Watchdog, Focus Timer, Dev Wellbeing):
```json
"activationEvents": ["onStartupFinished"]
```

---

## Extension Entry Point Pattern

Every `extension.ts` follows this exact structure:

```typescript
import * as vscode from 'vscode';

// Import service classes — never inline logic in activate()
import { MyService } from './services/myService';

let service: MyService | undefined;

export function activate(context: vscode.ExtensionContext): void {
    const outputChannel = vscode.window.createOutputChannel('Extension Name');
    context.subscriptions.push(outputChannel);

    service = new MyService(outputChannel);

    // Register all commands
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.commandId', () => {
            service?.doSomething();
        })
    );

    outputChannel.appendLine('Extension Name activated');
}

export function deactivate(): void {
    service?.dispose();
}
```

**Rules**:
- `activate()` is synchronous. Async init goes in a service constructor or lazy.
- Everything goes into `context.subscriptions` — no orphaned event listeners.
- `outputChannel` is the ONLY logging mechanism. Never `console.log`.

---

## Disposable Pattern

All services that hold resources must implement `vscode.Disposable`:

```typescript
export class MyService implements vscode.Disposable {
    private readonly outputChannel: vscode.OutputChannel;
    private disposables: vscode.Disposable[] = [];
    private intervalHandle: NodeJS.Timeout | undefined;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
        this.intervalHandle = setInterval(() => this.tick(), 60_000);
    }

    dispose(): void {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = undefined;
        }
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
```

---

## QuickPick Pattern

For user selection (used in MCP App Starter, Brandfetch, etc.):

```typescript
async function promptForChoice(items: string[]): Promise<string | undefined> {
    const picked = await vscode.window.showQuickPick(
        items.map(label => ({ label })),
        {
            placeHolder: 'Select an option',
            ignoreFocusOut: true  // keeps open when user clicks elsewhere
        }
    );
    return picked?.label;
}
```

---

## SecretStorage Pattern (MANDATORY for all API keys)

```typescript
// Storing a secret
async function saveApiKey(context: vscode.ExtensionContext, key: string): Promise<void> {
    await context.secrets.store('extensionName.apiKey', key);
}

// Retrieving a secret
async function getApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
    return context.secrets.get('extensionName.apiKey');
}

// Prompting if not set
async function ensureApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
    let key = await context.secrets.get('extensionName.apiKey');
    if (!key) {
        key = await vscode.window.showInputBox({
            prompt: 'Enter your API key',
            password: true,
            ignoreFocusOut: true
        });
        if (key) {
            await context.secrets.store('extensionName.apiKey', key);
        }
    }
    return key;
}
```

**NEVER** read from environment variables, workspace settings, or hardcode. SecretStorage only.

---

## Progress API Pattern

For operations taking >500ms (file scanning, API calls):

```typescript
await vscode.window.withProgress(
    {
        location: vscode.ProgressLocation.Notification,
        title: 'Scanning for secrets...',
        cancellable: true
    },
    async (progress, token) => {
        progress.report({ increment: 0, message: 'Starting...' });
        
        for (let i = 0; i < files.length; i++) {
            if (token.isCancellationRequested) { break; }
            await scanFile(files[i]);
            progress.report({ 
                increment: (100 / files.length),
                message: `${files[i].fsPath}`
            });
        }
    }
);
```

---

## Status Bar Pattern

For persistent indicators (Focus Timer, Workspace Watchdog health):

```typescript
const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, 
    100  // priority — higher = more left
);
statusBar.text = '$(clock) 25:00';
statusBar.tooltip = 'Focus Timer — click to pause';
statusBar.command = 'focusTimer.togglePause';
statusBar.show();
context.subscriptions.push(statusBar);
```

---

## Configuration Pattern

For settings exposed in package.json `contributes.configuration`:

```typescript
function getConfig<T>(key: string, defaultValue: T): T {
    return vscode.workspace.getConfiguration('extensionName').get<T>(key, defaultValue);
}

// Watch for settings changes
context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('extensionName')) {
            // reload
        }
    })
);
```

---

## File Watcher Pattern

Used by Workspace Watchdog and Secret Guard:

```typescript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.{ts,js,py}');
context.subscriptions.push(watcher);

watcher.onDidCreate(uri => handleFile(uri), null, context.subscriptions);
watcher.onDidChange(uri => handleFile(uri), null, context.subscriptions);
watcher.onDidDelete(uri => removeFile(uri), null, context.subscriptions);
```

---

## Diagnostics Collection Pattern

For Secret Guard — inline error markers in the editor:

```typescript
const diagnosticCollection = vscode.languages.createDiagnosticCollection('secretGuard');
context.subscriptions.push(diagnosticCollection);

function reportSecrets(uri: vscode.Uri, matches: SecretMatch[]): void {
    const diagnostics = matches.map(m => {
        const range = new vscode.Range(m.line, m.col, m.line, m.col + m.length);
        const diag = new vscode.Diagnostic(
            range,
            `Potential secret: ${m.type}`,
            vscode.DiagnosticSeverity.Error
        );
        diag.source = 'SecretGuard';
        return diag;
    });
    diagnosticCollection.set(uri, diagnostics);
}
```
