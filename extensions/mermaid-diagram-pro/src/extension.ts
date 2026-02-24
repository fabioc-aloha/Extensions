import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;

const DIAGRAM_TEMPLATES: { [key: string]: string } = {
    flowchart: '```mermaid\nflowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[End]\n```',
    sequence: '```mermaid\nsequenceDiagram\n    participant A\n    participant B\n    A->>B: Request\n    B-->>A: Response\n```',
    classDiagram: '```mermaid\nclassDiagram\n    class Animal {\n        +String name\n        +makeSound() void\n    }\n    class Dog {\n        +fetch() void\n    }\n    Animal <|-- Dog\n```',
    gitGraph: '```mermaid\ngitGraph\n   commit\n   branch feature\n   checkout feature\n   commit\n   checkout main\n   merge feature\n```',
    erDiagram: '```mermaid\nerDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n```',
    timeline: '```mermaid\ntimeline\n    title Project Timeline\n    section Phase 1\n        Task A : 2024\n        Task B : 2024\n    section Phase 2\n        Task C : 2025\n```'
};

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Mermaid Diagram Pro');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('mermaidPro.preview', () => previewAtCursor()),
        vscode.commands.registerCommand('mermaidPro.exportSvg', () => exportSvg()),
        vscode.commands.registerCommand('mermaidPro.insertTemplate', () => insertTemplate()),
        vscode.commands.registerCommand('mermaidPro.validateAll', () => validateAll())
    );

    outputChannel.appendLine('[Mermaid Diagram Pro] Activated.');
}

function extractDiagramAtCursor(editor: vscode.TextEditor): string | null {
    const text = editor.document.getText();
    const offset = editor.document.offsetAt(editor.selection.active);
    const before = text.lastIndexOf('```mermaid', offset);
    const after = text.indexOf('```', before + 10);
    if (before === -1 || after === -1) { return null; }
    return text.slice(before + 10, after).trim();
}

function previewAtCursor(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const diagram = extractDiagramAtCursor(editor);
    if (!diagram) { vscode.window.showWarningMessage('No Mermaid diagram block found at cursor.'); return; }
    // Open Mermaid Live Editor with diagram encoded
    const encoded = Buffer.from(JSON.stringify({ code: diagram, mermaid: { theme: 'default' } })).toString('base64');
    vscode.env.openExternal(vscode.Uri.parse(`https://mermaid.live/edit#base64:${encoded}`));
}

function exportSvg(): void {
    vscode.window.showInformationMessage('SVG export: install mmdc (Mermaid CLI) globally and run: mmdc -i input.md -o output.svg');
}

async function insertTemplate(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const choice = await vscode.window.showQuickPick(
        Object.keys(DIAGRAM_TEMPLATES).map(k => ({ label: k })),
        { title: 'Insert Diagram Template' }
    );
    if (!choice) { return; }
    editor.edit(eb => eb.insert(editor.selection.active, '\n' + DIAGRAM_TEMPLATES[choice.label] + '\n'));
}

function validateAll(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const text = editor.document.getText();
    const blocks = [...text.matchAll(/```mermaid([\s\S]*?)```/g)];
    outputChannel.clear();
    outputChannel.appendLine(`Found ${blocks.length} Mermaid block(s):`);
    blocks.forEach((b, i) => {
        const diag = b[1].trim();
        const firstLine = diag.split('\n')[0];
        outputChannel.appendLine(`  Block ${i + 1}: ${firstLine} (${diag.split('\n').length} lines)`);
    });
    if (blocks.length === 0) { vscode.window.showInformationMessage('No Mermaid diagram blocks found.'); }
    else { outputChannel.show(); }
}

export function deactivate(): void {
    outputChannel?.appendLine('[Mermaid Diagram Pro] Deactivated.');
}
