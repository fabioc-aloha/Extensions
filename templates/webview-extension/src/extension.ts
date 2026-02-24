import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;

class MyWebviewPanel {
    static currentPanel: MyWebviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    static createOrShow(context: vscode.ExtensionContext): void {
        if (MyWebviewPanel.currentPanel) { MyWebviewPanel.currentPanel._panel.reveal(); return; }
        const panel = vscode.window.createWebviewPanel('myWebview', 'My Webview', vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true });
        MyWebviewPanel.currentPanel = new MyWebviewPanel(panel, context);
    }

    private constructor(panel: vscode.WebviewPanel, _context: vscode.ExtensionContext) {
        this._panel = panel;
        this._panel.webview.html = this._getHtml();
        this._panel.onDidDispose(() => { MyWebviewPanel.currentPanel = undefined; this._dispose(); }, null, this._disposables);
        this._panel.webview.onDidReceiveMessage(msg => {
            if (msg.type === 'hello') { vscode.window.showInformationMessage(`Webview says: ${msg.text}`); }
        }, null, this._disposables);
    }

    private _getHtml(): string {
        return `<!DOCTYPE html><html><body>
        <h1>My Webview</h1>
        <button onclick="vscode.postMessage({type:'hello',text:'Hello from webview!'})">Click me</button>
        <script>const vscode = acquireVsCodeApi();</script>
        </body></html>`;
    }

    private _dispose(): void {
        this._panel.dispose();
        this._disposables.forEach(d => d.dispose());
    }
}

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('My Webview Extension');
    context.subscriptions.push(outputChannel);
    context.subscriptions.push(
        vscode.commands.registerCommand('myWebview.open', () => MyWebviewPanel.createOrShow(context))
    );
    outputChannel.appendLine('[My Webview Extension] Activated.');
}

export function deactivate(): void {
    outputChannel?.appendLine('[My Webview Extension] Deactivated.');
}
