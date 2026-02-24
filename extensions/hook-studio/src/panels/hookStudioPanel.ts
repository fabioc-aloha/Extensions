import * as vscode from 'vscode';

/**
 * Hook Studio main Webview panel.
 * Three-tab UI: Rule Builder | Execution Log | Condition Tester
 */
export class HookStudioPanel {
    static currentPanel: HookStudioPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    static createOrShow(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): void {
        if (HookStudioPanel.currentPanel) {
            HookStudioPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
            return;
        }
        const panel = vscode.window.createWebviewPanel(
            'hookStudio',
            'Hook Studio',
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );
        HookStudioPanel.currentPanel = new HookStudioPanel(panel, context, outputChannel);
    }

    static simulateTool(toolName: string): void {
        HookStudioPanel.currentPanel?._panel.webview.postMessage({ type: 'simulateTool', toolName });
    }

    static loadFile(uri: vscode.Uri): void {
        HookStudioPanel.currentPanel?._panel.webview.postMessage({ type: 'loadFile', path: uri.fsPath });
    }

    static exportTo(uri: vscode.Uri): void {
        HookStudioPanel.currentPanel?._panel.webview.postMessage({ type: 'export', path: uri.fsPath });
    }

    static notifyFileChanged(uri: vscode.Uri): void {
        HookStudioPanel.currentPanel?._panel.webview.postMessage({ type: 'fileChanged', path: uri.fsPath });
    }

    private constructor(
        panel: vscode.WebviewPanel,
        private readonly context: vscode.ExtensionContext,
        private readonly outputChannel: vscode.OutputChannel
    ) {
        this._panel = panel;
        this._update();
        this._panel.onDidDispose(() => this._dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(msg => this._handleMessage(msg), null, this._disposables);
    }

    private _handleMessage(message: { type: string; [key: string]: unknown }): void {
        switch (message.type) {
            case 'log':
                this.outputChannel.appendLine(`[Hook] ${message.text}`);
                break;
            case 'save':
                this._saveHooks(message.content as string);
                break;
        }
    }

    private async _saveHooks(content: string): Promise<void> {
        const workspaces = vscode.workspace.workspaceFolders;
        if (!workspaces) { return; }
        const uri = vscode.Uri.joinPath(workspaces[0].uri, '.github', 'hooks.json');
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf-8'));
        this.outputChannel.appendLine('[Hook Studio] hooks.json saved.');
    }

    private _update(): void {
        this._panel.webview.html = this._getHtmlContent();
    }

    private _getHtmlContent(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Hook Studio</title>
    <style>
        body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 16px; }
        .tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--vscode-panel-border); margin-bottom: 16px; }
        .tab { padding: 8px 16px; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab.active { border-bottom-color: var(--vscode-focusBorder); }
        .panel { display: none; }
        .panel.active { display: block; }
        textarea { width: 100%; height: 300px; font-family: monospace; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 8px; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 8px 16px; cursor: pointer; margin: 4px; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        .log-entry { padding: 4px 0; font-family: monospace; font-size: 12px; border-bottom: 1px solid var(--vscode-panel-border); }
    </style>
</head>
<body>
    <h2>🪝 Hook Studio</h2>
    <div class="tabs">
        <div class="tab active" onclick="showTab('builder')">Rule Builder</div>
        <div class="tab" onclick="showTab('log')">Execution Log</div>
        <div class="tab" onclick="showTab('tester')">Condition Tester</div>
    </div>

    <div id="builder" class="panel active">
        <h3>hooks.json Editor</h3>
        <textarea id="hooksEditor" placeholder="Paste or edit your hooks.json here..."></textarea>
        <br>
        <button onclick="saveHooks()">💾 Save hooks.json</button>
        <button onclick="validateHooks()">✅ Validate</button>
        <div id="validationResult"></div>
    </div>

    <div id="log" class="panel">
        <h3>Execution Log</h3>
        <div id="logEntries"><em>Hook execution events will appear here...</em></div>
    </div>

    <div id="tester" class="panel">
        <h3>Condition Tester</h3>
        <p>Simulate a tool call to preview which hooks would fire.</p>
        <input type="text" id="toolInput" placeholder="Tool name (e.g. createFile)" style="width:300px;padding:4px;" />
        <button onclick="simulateTool()">▶ Run Simulation</button>
        <div id="simResult"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        function showTab(name) {
            document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', ['builder','log','tester'][i] === name));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.getElementById(name).classList.add('active');
        }
        function saveHooks() {
            vscode.postMessage({ type: 'save', content: document.getElementById('hooksEditor').value });
        }
        function validateHooks() {
            try {
                JSON.parse(document.getElementById('hooksEditor').value);
                document.getElementById('validationResult').textContent = '✅ Valid JSON';
            } catch(e) {
                document.getElementById('validationResult').textContent = '❌ Invalid JSON: ' + e.message;
            }
        }
        function simulateTool() {
            const tool = document.getElementById('toolInput').value;
            vscode.postMessage({ type: 'log', text: 'Simulating tool: ' + tool });
            document.getElementById('simResult').textContent = 'Simulating ' + tool + '...';
        }
        window.addEventListener('message', e => {
            const msg = e.data;
            if (msg.type === 'simulateTool') document.getElementById('toolInput').value = msg.toolName;
            if (msg.type === 'fileChanged') vscode.postMessage({ type: 'log', text: 'External change detected: ' + msg.path });
        });
    </script>
</body>
</html>`;
    }

    private _dispose(): void {
        HookStudioPanel.currentPanel = undefined;
        this._panel.dispose();
        this._disposables.forEach(d => d.dispose());
        this._disposables = [];
    }
}
