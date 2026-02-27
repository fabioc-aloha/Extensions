import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let outputChannel: vscode.OutputChannel;let previewPanel: vscode.WebviewPanel | undefined;
// ---------------------------------------------------------------------------
// Diagram Templates — aligned with Alex's markdown-mermaid skill
// ---------------------------------------------------------------------------
const DIAGRAM_TEMPLATES: Record<string, { label: string; description: string; code: string }> = {
    flowchart: {
        label: 'Flowchart',
        description: 'Decision flow with branching',
        code: '```mermaid\nflowchart TD\n    A[Start] --> B{Decision?}\n    B -->|Yes| C[Action]\n    B -->|No| D[End]\n    C --> D\n```'
    },
    sequence: {
        label: 'Sequence Diagram',
        description: 'Actor interactions over time',
        code: '```mermaid\nsequenceDiagram\n    participant Client\n    participant Server\n    Client->>Server: Request\n    Server-->>Client: Response\n    Note over Client,Server: HTTP/REST\n```'
    },
    classDiagram: {
        label: 'Class Diagram',
        description: 'Object-oriented relationships',
        code: '```mermaid\nclassDiagram\n    class Animal {\n        +String name\n        +makeSound() void\n    }\n    class Dog {\n        +fetch() void\n    }\n    Animal <|-- Dog : inherits\n```'
    },
    erDiagram: {
        label: 'Entity Relationship',
        description: 'Database entity relationships',
        code: '```mermaid\nerDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    PRODUCT ||--o{ LINE-ITEM : "included in"\n```'
    },
    gitGraph: {
        label: 'Git Graph',
        description: 'Branch and merge history',
        code: '```mermaid\ngitGraph\n   commit id: "initial"\n   branch feature\n   checkout feature\n   commit id: "add feature"\n   commit id: "fix tests"\n   checkout main\n   merge feature id: "merge PR"\n   commit id: "release"\n```'
    },
    timeline: {
        label: 'Timeline',
        description: 'Project milestones over time',
        code: '```mermaid\ntimeline\n    title Project Roadmap\n    section Q1\n        Research : Foundation work\n        Prototype : MVP build\n    section Q2\n        Beta : Testing phase\n        Launch : Public release\n```'
    },
    gantt: {
        label: 'Gantt Chart',
        description: 'Project schedule with dependencies',
        code: '```mermaid\ngantt\n    title Project Schedule\n    dateFormat  YYYY-MM-DD\n    section Planning\n    Requirements   :done,    req,  2024-01-01, 2024-01-14\n    Design         :active,  des,  2024-01-15, 2024-01-28\n    section Build\n    Development    :         dev,  2024-01-29, 30d\n    Testing        :         test, after dev,  14d\n```'
    },
    pie: {
        label: 'Pie Chart',
        description: 'Proportional data breakdown',
        code: '```mermaid\npie title Technology Stack\n    "TypeScript" : 45\n    "Python" : 25\n    "Rust" : 20\n    "Other" : 10\n```'
    },
    mindmap: {
        label: 'Mind Map',
        description: 'Hierarchical concept map',
        code: '```mermaid\nmindmap\n  root((Project))\n    Goals\n      Performance\n      Reliability\n    Tech Stack\n      Frontend\n      Backend\n    Team\n      Dev\n      QA\n```'
    },
    stateDiagram: {
        label: 'State Diagram',
        description: 'Finite state machine',
        code: '```mermaid\nstateDiagram-v2\n    [*] --> Idle\n    Idle --> Processing : start\n    Processing --> Success : complete\n    Processing --> Error : fail\n    Error --> Idle : retry\n    Success --> [*]\n```'
    },
    c4Context: {
        label: 'C4 Context',
        description: 'System context diagram (C4 model)',
        code: '```mermaid\nC4Context\n    title System Context\n    Person(user, "User", "End user")\n    System(system, "My System", "Core application")\n    System_Ext(ext, "External API", "Third-party service")\n    Rel(user, system, "Uses")\n    Rel(system, ext, "Calls")\n```'
    }
};

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Mermaid Diagram Pro');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('mermaidPro.preview',
            () => previewAtCursor()),
        vscode.commands.registerCommand('mermaidPro.openInBrowser',
            () => openInBrowser()),
        vscode.commands.registerCommand('mermaidPro.exportSvg',
            () => exportDiagram('svg')),
        vscode.commands.registerCommand('mermaidPro.exportPng',
            () => exportDiagram('png')),
        vscode.commands.registerCommand('mermaidPro.insertTemplate',
            () => insertTemplate()),
        vscode.commands.registerCommand('mermaidPro.validateAll',
            () => validateAll()),
        vscode.commands.registerCommand('mermaidPro.extractDiagram',
            () => extractToFile()),
        vscode.commands.registerCommand('mermaidPro.copySource',
            () => copyDiagramSource())
    );

    // Auto-refresh preview panel when document changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            if (previewPanel && vscode.window.activeTextEditor?.document === e.document) {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const diagram = extractDiagramAtCursor(editor);
                    if (diagram) {
                        previewPanel.webview.html = getMermaidhtml(diagram, detectDiagramType(diagram));
                    }
                }
            }
        })
    );

    outputChannel.appendLine('[Mermaid Diagram Pro] Activated — 11 templates, in-editor preview, SVG/PNG export via mmdc.');
}

// ---------------------------------------------------------------------------
// Diagram extraction helpers
// ---------------------------------------------------------------------------

interface DiagramBlock {
    code: string;
    start: number;  // line number (1-based)
    type: string;
}

function extractDiagramAtCursor(editor: vscode.TextEditor): string | null {
    const text = editor.document.getText();
    const offset = editor.document.offsetAt(editor.selection.active);
    const before = text.lastIndexOf('```mermaid', offset);
    const after = text.indexOf('```', before + 10);
    if (before === -1 || after === -1) { return null; }
    return text.slice(before + 10, after).trim();
}

function getAllDiagramBlocks(editor: vscode.TextEditor): DiagramBlock[] {
    const text = editor.document.getText();
    const results: DiagramBlock[] = [];
    const regex = /```mermaid\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const code = match[1].trim();
        const firstLine = code.split('\n')[0].trim();
        const lineNum = editor.document.positionAt(match.index).line + 1;
        results.push({ code, start: lineNum, type: firstLine });
    }
    return results;
}

function detectDiagramType(code: string): string {
    const first = code.trim().split('\n')[0].toLowerCase();
    if (first.startsWith('flowchart') || first.startsWith('graph')) { return 'flowchart'; }
    if (first.startsWith('sequencediagram')) { return 'sequence'; }
    if (first.startsWith('classdiagram')) { return 'class'; }
    if (first.startsWith('erdiagram')) { return 'ER'; }
    if (first.startsWith('gitgraph')) { return 'git'; }
    if (first.startsWith('gantt')) { return 'gantt'; }
    if (first.startsWith('pie')) { return 'pie'; }
    if (first.startsWith('mindmap')) { return 'mindmap'; }
    if (first.startsWith('timeline')) { return 'timeline'; }
    if (first.startsWith('statediagram')) { return 'state'; }
    if (first.startsWith('c4')) { return 'C4'; }
    return 'unknown';
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function previewAtCursor(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const diagram = extractDiagramAtCursor(editor);
    if (!diagram) {
        vscode.window.showWarningMessage('No Mermaid diagram block found at cursor. Place cursor inside a ```mermaid block.');
        return;
    }
    const type = detectDiagramType(diagram);

    if (previewPanel) {
        previewPanel.reveal(vscode.ViewColumn.Beside, true);
    } else {
        previewPanel = vscode.window.createWebviewPanel(
            'mermaidPreview',
            `Mermaid: ${type}`,
            { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
            { enableScripts: true, retainContextWhenHidden: true }
        );
        previewPanel.onDidDispose(() => { previewPanel = undefined; });
    }
    previewPanel.title = `Mermaid: ${type}`;
    previewPanel.webview.html = getMermaidhtml(diagram, type);
}

function openInBrowser(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const diagram = extractDiagramAtCursor(editor);
    if (!diagram) {
        vscode.window.showWarningMessage('No Mermaid diagram block found at cursor.');
        return;
    }
    const payload = JSON.stringify({ code: diagram, mermaid: { theme: 'default' } });
    const encoded = Buffer.from(payload).toString('base64');
    vscode.env.openExternal(vscode.Uri.parse(`https://mermaid.live/edit#base64:${encoded}`));
}

function getMermaidhtml(diagram: string, type: string): string {
    const escaped = diagram
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src https://cdn.jsdelivr.net 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 16px;
      background: #1e1e1e;
      display: flex; flex-direction: column; align-items: center;
      min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .toolbar {
      width: 100%; max-width: 900px; display: flex; justify-content: space-between;
      align-items: center; margin-bottom: 12px;
    }
    .label { color: #9cdcfe; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .hint { color: #6a9955; font-size: 11px; }
    #diagram-container {
      background: white; border-radius: 8px; padding: 32px;
      max-width: 900px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    .mermaid { width: 100%; }
    #error { color: #f44747; background: #2d1a1a; padding: 12px 16px; border-radius: 6px;
      font-family: monospace; font-size: 13px; width: 100%; max-width: 900px;
      margin-top: 12px; display: none; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="toolbar">
    <span class="label">${type}</span>
    <span class="hint">Edit the diagram in the editor — preview auto-refreshes</span>
  </div>
  <div id="diagram-container">
    <div class="mermaid">${escaped}</div>
  </div>
  <div id="error"></div>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Segoe UI, sans-serif'
    });
    async function render() {
      const el = document.querySelector('.mermaid');
      const errEl = document.getElementById('error');
      try {
        const id = 'mermaid-' + Date.now();
        const { svg } = await mermaid.render(id, el.textContent.trim()
          .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"'));
        el.innerHTML = svg;
        errEl.style.display = 'none';
      } catch(e) {
        errEl.textContent = 'Syntax error: ' + e.message;
        errEl.style.display = 'block';
      }
    }
    render();
  </script>
</body>
</html>`;
}


async function exportDiagram(format: 'svg' | 'png'): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const diagram = extractDiagramAtCursor(editor);
    if (!diagram) {
        vscode.window.showWarningMessage('No Mermaid diagram block found at cursor. Place your cursor inside a ```mermaid block.');
        return;
    }

    const config = vscode.workspace.getConfiguration('mermaidPro');
    const mmdcPath = config.get<string>('mmdcPath') ?? 'mmdc';
    const theme = config.get<string>('theme') ?? 'default';
    const background = format === 'png' ? (config.get<string>('pngBackground') ?? 'white') : 'transparent';

    const docDir = path.dirname(editor.document.uri.fsPath);
    const defaultName = `diagram-${Date.now()}.${format}`;
    const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(docDir, defaultName)),
        filters: format === 'svg'
            ? { 'SVG Image': ['svg'] }
            : { 'PNG Image': ['png'] }
    });
    if (!saveUri) { return; }

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'mermaid-'));
    const mmdFile = path.join(tmpDir, 'diagram.mmd');
    await fs.promises.writeFile(mmdFile, diagram, 'utf-8');

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Exporting ${format.toUpperCase()}...`, cancellable: false },
        async () => {
            try {
                await runMmdc(mmdcPath, [
                    '-i', mmdFile,
                    '-o', saveUri.fsPath,
                    '-t', theme,
                    '-b', background
                ]);
                outputChannel.appendLine(`✅ Exported: ${saveUri.fsPath}`);
                vscode.window.showInformationMessage(
                    `✅ ${format.toUpperCase()} exported: ${path.basename(saveUri.fsPath)}`,
                    'Reveal'
                ).then(c => {
                    if (c) { vscode.commands.executeCommand('revealFileInOS', saveUri); }
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                vscode.window.showErrorMessage(`Export failed: ${msg}`, 'Install mmdc').then(c => {
                    if (c) {
                        vscode.env.openExternal(vscode.Uri.parse('https://github.com/mermaid-js/mermaid-cli'));
                    }
                });
                outputChannel.appendLine(`❌ Export error: ${msg}`);
            } finally {
                try { await fs.promises.unlink(mmdFile); } catch { /* ignore */ }
                try { await fs.promises.rmdir(tmpDir); } catch { /* ignore */ }
            }
        }
    );
}

async function insertTemplate(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const items = Object.entries(DIAGRAM_TEMPLATES).map(([, v]) => ({
        label: v.label,
        description: v.description,
        code: v.code
    }));

    const choice = await vscode.window.showQuickPick(items, {
        title: 'Insert Mermaid Diagram Template',
        matchOnDescription: true
    });
    if (!choice) { return; }

    editor.edit(eb => eb.insert(editor.selection.active, '\n' + choice.code + '\n'));
}

function validateAll(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const blocks = getAllDiagramBlocks(editor);
    outputChannel.clear();

    if (blocks.length === 0) {
        vscode.window.showInformationMessage('No Mermaid diagram blocks found in this file.');
        return;
    }

    outputChannel.appendLine(`Mermaid Diagram Validation — ${blocks.length} block(s) found`);
    outputChannel.appendLine('═'.repeat(60));

    blocks.forEach((b, i) => {
        const type = detectDiagramType(b.code);
        const lines = b.code.split('\n').length;
        outputChannel.appendLine(`  ${i + 1}. Line ${b.start} — ${type.padEnd(12)} ${lines} lines`);
        outputChannel.appendLine(`     First: ${b.type}`);
    });

    outputChannel.appendLine('');
    outputChannel.appendLine(`Total: ${blocks.length} diagram(s). Open mermaid.live to preview individual blocks.`);
    outputChannel.show();

    vscode.window.showInformationMessage(
        `Found ${blocks.length} Mermaid diagram(s). See Output panel for details.`,
        'Show Output'
    ).then(c => { if (c) { outputChannel.show(); } });
}

async function extractToFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const diagram = extractDiagramAtCursor(editor);
    if (!diagram) {
        vscode.window.showWarningMessage('No Mermaid diagram block found at cursor.');
        return;
    }

    const docDir = path.dirname(editor.document.uri.fsPath);
    const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(docDir, 'diagram.mmd')),
        filters: { 'Mermaid File': ['mmd'] }
    });
    if (!saveUri) { return; }

    await fs.promises.writeFile(saveUri.fsPath, diagram, 'utf-8');
    vscode.window.showInformationMessage(`✅ Diagram extracted to ${path.basename(saveUri.fsPath)}`);
}

async function copyDiagramSource(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const diagram = extractDiagramAtCursor(editor);
    if (!diagram) {
        vscode.window.showWarningMessage('No Mermaid diagram block found at cursor.');
        return;
    }
    await vscode.env.clipboard.writeText(diagram);
    vscode.window.showInformationMessage('✅ Diagram source copied to clipboard.');
}

// ---------------------------------------------------------------------------
// mmdc runner
// ---------------------------------------------------------------------------

function runMmdc(mmdcPath: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = cp.spawn(mmdcPath, args);
        let stderr = '';
        proc.stderr.on('data', d => { stderr += d.toString(); });
        proc.on('close', code => {
            if (code === 0) { resolve(); }
            else { reject(new Error(`mmdc exited ${code}: ${stderr}`)); }
        });
        proc.on('error', (err) => {
            reject(new Error(
                `Could not start mmdc: ${err.message}. `
                + `Install with: npm install -g @mermaid-js/mermaid-cli`
            ));
        });
    });
}

export function deactivate(): void {
    outputChannel?.appendLine('[Mermaid Diagram Pro] Deactivated.');
}
