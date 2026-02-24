---
name: "webview-architecture"
description: "CSP-compliant VS Code webview panels — message passing, panel persistence, HTML templating"
---

# Webview Architecture Skill

**Trifecta**: Extension Development Mastery (2 of 3)
**Activation**: webview, WebviewPanel, postMessage, createWebviewPanel, CSP, HTML panel, 3-tab
**Last Validated**: 2026-02-20 | VS Code 1.109

---

## Webview Panel Basics

```typescript
export class MyPanel {
    public static currentPanel: MyPanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        
        // Render initial HTML
        this.panel.webview.html = this.getHtml(panel.webview, extensionUri);

        // Listen for messages FROM the webview
        this.panel.webview.onDidReceiveMessage(
            msg => this.handleMessage(msg),
            null,
            this.disposables
        );

        // Clean up when panel closes
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }

    // Singleton: show or create
    static createOrShow(extensionUri: vscode.Uri): void {
        const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

        if (MyPanel.currentPanel) {
            MyPanel.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'myPanel',          // internal id
            'My Panel',         // display title
            column,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        MyPanel.currentPanel = new MyPanel(panel, extensionUri);
    }

    // Send message TO the webview
    postMessage(message: unknown): void {
        this.panel.webview.postMessage(message);
    }

    dispose(): void {
        MyPanel.currentPanel = undefined;
        this.panel.dispose();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
```

---

## Content Security Policy (MANDATORY)

Every webview HTML **must** include a CSP meta tag. Without it, VS Code shows security warnings and remote resources are blocked.

```typescript
private getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // Generate a nonce for inline scripts
    const nonce = this.getNonce();
    
    // Convert local file URIs to webview-safe URIs
    const styleUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'media', 'main.css')
    );
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'media', 'main.js')
    );

    return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        style-src ${webview.cspSource} 'unsafe-inline';
        script-src 'nonce-${nonce}';
        img-src ${webview.cspSource} https: data:;
    ">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${styleUri}">
    <title>My Panel</title>
</head>
<body>
    <div id="app"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

private getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
```

---

## Message Passing (Extension ↔ Webview)

**Extension → Webview** (push data):
```typescript
// In extension code
panel.webview.postMessage({ type: 'updateData', payload: jsonData });
```

**Webview → Extension** (user action):
```javascript
// In webview JavaScript (media/main.js)
const vscode = acquireVsCodeApi();

document.getElementById('saveBtn').addEventListener('click', () => {
    vscode.postMessage({ type: 'save', data: getFormData() });
});

// Listen for responses
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
        case 'updateData':
            renderData(message.payload);
            break;
    }
});
```

**Extension handles incoming messages**:
```typescript
private handleMessage(message: { type: string; [key: string]: unknown }): void {
    switch (message.type) {
        case 'save':
            this.handleSave(message.data as SavePayload);
            break;
        case 'ready':
            // Webview loaded, send initial data
            this.postMessage({ type: 'init', data: this.loadData() });
            break;
    }
}
```

---

## Tab Pattern (Hook Studio 3-Tab Layout)

```html
<!-- In webview HTML -->
<div class="tabs">
    <button class="tab active" data-tab="editor">Editor</button>
    <button class="tab" data-tab="runner">Runner</button>
    <button class="tab" data-tab="log">Log</button>
</div>
<div id="editor" class="tab-content active">...</div>
<div id="runner" class="tab-content">...</div>
<div id="log" class="tab-content">...</div>
```

```javascript
// In media/main.js
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});
```

---

## VS Code Theme Variables

Use CSS variables to match VS Code's active theme:

```css
body {
    background-color: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
}

button {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border: none;
    padding: 4px 12px;
    cursor: pointer;
}

button:hover {
    background-color: var(--vscode-button-hoverBackground);
}

input, textarea {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
}
```

---

## Persisting State Across Reload

The webview loses DOM state when hidden. Use `acquireVsCodeApi().setState()`:

```javascript
// In webview JS — save state before hide
const vscode = acquireVsCodeApi();
const state = vscode.getState() || {};

function saveState() {
    vscode.setState({ 
        activeTab: getActiveTab(), 
        formData: getFormData() 
    });
}

// Restore on load
const prevState = vscode.getState();
if (prevState) {
    restoreTab(prevState.activeTab);
    restoreForm(prevState.formData);
}
```

---

## Retaining Panel on Hide

By default, the webview HTML is destroyed when the panel is hidden. To retain it:

```typescript
const panel = vscode.window.createWebviewPanel(
    'myPanel', 'My Panel', column,
    {
        enableScripts: true,
        retainContextWhenHidden: true,  // keeps DOM alive
        localResourceRoots: [...]
    }
);
```

**Cost**: Higher memory usage. Use only for complex interactive panels (Hook Studio).

---

## TreeView DataProvider (for Log/List panels)

```typescript
export class HookLogProvider implements vscode.TreeDataProvider<LogItem> {
    private items: LogItem[] = [];
    private _onDidChangeTreeData = new vscode.EventEmitter<LogItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(newItems: LogItem[]): void {
        this.items = newItems;
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: LogItem): vscode.TreeItem {
        return element;
    }

    getChildren(): LogItem[] {
        return this.items;
    }
}

// Register in activate()
const provider = new HookLogProvider();
context.subscriptions.push(
    vscode.window.registerTreeDataProvider('myView', provider)
);
```
