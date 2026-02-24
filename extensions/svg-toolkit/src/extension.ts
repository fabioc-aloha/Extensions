import * as vscode from 'vscode';
import * as fs from 'fs';

let outputChannel: vscode.OutputChannel;

const ICON_TEMPLATES: { [key: string]: string } = {
    circle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">\n  <circle cx="12" cy="12" r="10" fill="currentColor"/>\n</svg>',
    checkmark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">\n  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>\n</svg>',
    arrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">\n  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>\n</svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">\n  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor"/>\n</svg>'
};

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('SVG Toolkit');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('svgToolkit.preview', (uri?: vscode.Uri) => previewSvg(uri)),
        vscode.commands.registerCommand('svgToolkit.copyDataUri', (uri?: vscode.Uri) => copyDataUri(uri)),
        vscode.commands.registerCommand('svgToolkit.copyMarkdown', (uri?: vscode.Uri) => copyMarkdown(uri)),
        vscode.commands.registerCommand('svgToolkit.insertIconTemplate', () => insertTemplate()),
        vscode.commands.registerCommand('svgToolkit.validateSvg', () => validateSvg())
    );

    outputChannel.appendLine('[SVG Toolkit] Activated.');
}

function getSvgContent(uri?: vscode.Uri): string | null {
    const targetUri = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!targetUri) { return null; }
    try { return fs.readFileSync(targetUri.fsPath, 'utf-8'); } catch { return null; }
}

function previewSvg(uri?: vscode.Uri): void {
    const svg = getSvgContent(uri);
    if (!svg) { vscode.window.showWarningMessage('No SVG file found.'); return; }
    const panel = vscode.window.createWebviewPanel('svgPreview', 'SVG Preview', vscode.ViewColumn.Beside, { enableScripts: false });
    panel.webview.html = `<!DOCTYPE html><html><body style="background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;">${svg}</body></html>`;
}

async function copyDataUri(uri?: vscode.Uri): Promise<void> {
    const svg = getSvgContent(uri);
    if (!svg) { vscode.window.showWarningMessage('No SVG file found.'); return; }
    const encoded = Buffer.from(svg).toString('base64');
    const dataUri = `data:image/svg+xml;base64,${encoded}`;
    await vscode.env.clipboard.writeText(dataUri);
    vscode.window.showInformationMessage('✅ SVG data URI copied to clipboard.');
}

async function copyMarkdown(uri?: vscode.Uri): Promise<void> {
    const targetUri = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!targetUri) { return; }
    const svg = getSvgContent(targetUri);
    if (!svg) { return; }
    const encoded = Buffer.from(svg).toString('base64');
    const md = `![icon](data:image/svg+xml;base64,${encoded})`;
    await vscode.env.clipboard.writeText(md);
    vscode.window.showInformationMessage('✅ Markdown image with inline SVG copied.');
}

async function insertTemplate(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const choice = await vscode.window.showQuickPick(
        Object.keys(ICON_TEMPLATES).map(k => ({ label: k })),
        { title: 'Insert SVG Icon Template' }
    );
    if (!choice) { return; }
    editor.edit(eb => eb.insert(editor.selection.active, '\n' + ICON_TEMPLATES[choice.label] + '\n'));
}

function validateSvg(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const text = editor.document.getText();
    const hasSvgTag = /<svg[\s\S]*?<\/svg>/.test(text);
    const hasViewBox = /viewBox/.test(text);
    const hasXmlns = /xmlns/.test(text);
    outputChannel.clear();
    outputChannel.appendLine('SVG Validation:');
    outputChannel.appendLine(`  <svg> tag: ${hasSvgTag ? '✅' : '❌'}`);
    outputChannel.appendLine(`  viewBox: ${hasViewBox ? '✅' : '⚠️ missing (may affect scaling)'}`);
    outputChannel.appendLine(`  xmlns: ${hasXmlns ? '✅' : '⚠️ missing'}`);
    outputChannel.show();
}

export function deactivate(): void {
    outputChannel?.appendLine('[SVG Toolkit] Deactivated.');
}
