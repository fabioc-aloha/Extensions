import * as vscode from 'vscode';
import * as path from 'path';
import { SecretScanner } from '@alex-extensions/shared';

let outputChannel: vscode.OutputChannel;
let diagnosticCollection: vscode.DiagnosticCollection;
let statusBar: vscode.StatusBarItem;
let scanDebounce: ReturnType<typeof setTimeout> | undefined;
const scanner = new SecretScanner();

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('SecretGuard');
    diagnosticCollection = vscode.languages.createDiagnosticCollection('secretGuard');
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 90);
    statusBar.command = 'secretGuard.viewReport';
    context.subscriptions.push(outputChannel, diagnosticCollection, statusBar);

    context.subscriptions.push(
        vscode.commands.registerCommand('secretGuard.scanWorkspace', () => scanWorkspace()),
        vscode.commands.registerCommand('secretGuard.scanFile', (uri?: vscode.Uri) => scanCurrentFile(uri)),
        vscode.commands.registerCommand('secretGuard.viewReport', () => outputChannel.show()),
        vscode.commands.registerCommand('secretGuard.addIgnorePattern', () => addIgnorePattern()),
        vscode.commands.registerCommand('secretGuard.clearFile', () => clearCurrentFile())
    );

    // Real-time scan as-you-type (debounced 600ms)
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            const config = vscode.workspace.getConfiguration('secretGuard');
            if (!config.get('enabled') || !config.get('scanOnType')) { return; }
            if (scanDebounce) { clearTimeout(scanDebounce); }
            scanDebounce = setTimeout(() => {
                scanDocument(e.document);
                updateStatusBar(e.document);
            }, 600);
        }),
        vscode.workspace.onDidSaveTextDocument(doc => {
            const config = vscode.workspace.getConfiguration('secretGuard');
            if (config.get('enabled') && config.get('scanOnSave')) {
                scanDocument(doc);
                updateStatusBar(doc);
            }
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            updateStatusBar(editor?.document);
        })
    );

    // Scan active file on startup
    if (vscode.window.activeTextEditor) {
        const config = vscode.workspace.getConfiguration('secretGuard');
        if (config.get('enabled')) {
            scanDocument(vscode.window.activeTextEditor.document);
        }
    }
    updateStatusBar(vscode.window.activeTextEditor?.document);
    outputChannel.appendLine('[SecretGuard] Activated. Protecting your secrets.');
}

async function scanWorkspace(): Promise<void> {
    const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**,**/.git/**,**/out/**,**/dist/**');
    let totalFindings = 0;
    diagnosticCollection.clear();

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'SecretGuard: Scanning workspace...', cancellable: false },
        async (progress) => {
            for (let i = 0; i < files.length; i++) {
                progress.report({ increment: (1 / files.length) * 100, message: path.basename(files[i].fsPath) });
                try {
                    const doc = await vscode.workspace.openTextDocument(files[i]);
                    const findings = scanDocument(doc);
                    totalFindings += findings;
                } catch { /* skip binary files */ }
            }
        }
    );

    const msg = totalFindings === 0
        ? '✅ SecretGuard: No secrets found in workspace.'
        : `⚠️ SecretGuard: ${totalFindings} potential secret(s) found. Check Problems panel.`;
    vscode.window.showInformationMessage(msg, 'View Report').then(c => { if (c) outputChannel.show(); });
}

async function scanCurrentFile(uri?: vscode.Uri): Promise<void> {
    let doc: vscode.TextDocument;
    if (uri) {
        doc = await vscode.workspace.openTextDocument(uri);
    } else {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { vscode.window.showInformationMessage('No active editor.'); return; }
        doc = editor.document;
    }
    const count = scanDocument(doc);
    updateStatusBar(doc);
    if (count === 0) {
        vscode.window.showInformationMessage('✅ No secrets found in current file.');
    } else {
        vscode.window.showWarningMessage(`⚠️ ${count} potential secret(s) found. Check Problems panel.`);
    }
}

function scanDocument(doc: vscode.TextDocument): number {
    const text = doc.getText();
    const findings = scanner.scan(text, doc.fileName);
    const diagnostics: vscode.Diagnostic[] = [];

    for (const finding of findings) {
        const line = finding.line - 1;
        const lineText = doc.lineAt(Math.min(line, doc.lineCount - 1)).text;
        const range = new vscode.Range(
            Math.max(0, line), 0,
            Math.max(0, line), lineText.length
        );
        const severity = finding.severity === 'critical' ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
        const diag = new vscode.Diagnostic(range, `[SecretGuard] ${finding.patternName}: potential secret detected`, severity);
        diag.source = 'SecretGuard';
        diagnostics.push(diag);
        outputChannel.appendLine(`[${finding.severity.toUpperCase()}] ${doc.fileName}:${finding.line} — ${finding.patternName}`);
    }

    if (diagnostics.length > 0) {
        diagnosticCollection.set(doc.uri, diagnostics);
    }
    return findings.length;
}

async function addIgnorePattern(): Promise<void> {
    const pattern = await vscode.window.showInputBox({
        title: 'Add Ignore Pattern',
        prompt: 'Glob pattern to exclude from scanning (e.g. **/*.test.ts)'
    });
    if (!pattern) { return; }
    const config = vscode.workspace.getConfiguration('secretGuard');
    const existing = config.get<string[]>('ignorePatterns') ?? [];
    await config.update('ignorePatterns', [...existing, pattern], vscode.ConfigurationTarget.Workspace);
    vscode.window.showInformationMessage(`SecretGuard: Added ignore pattern "${pattern}"`);
}

function updateStatusBar(doc?: vscode.TextDocument): void {
    const target = doc ?? vscode.window.activeTextEditor?.document;
    if (!target || target.uri.scheme !== 'file') { statusBar.hide(); return; }
    const existing = diagnosticCollection.get(target.uri);
    const count = existing?.length ?? 0;
    if (count === 0) {
        statusBar.text = '$(shield) SecretGuard';
        statusBar.tooltip = 'No secrets detected — click to view report';
        statusBar.backgroundColor = undefined;
    } else {
        statusBar.text = `$(warning) ${count} secret${count === 1 ? '' : 's'}`;
        statusBar.tooltip = `SecretGuard: ${count} potential secret(s) in current file — click to view report`;
        statusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
    statusBar.show();
}

function clearCurrentFile(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    diagnosticCollection.delete(editor.document.uri);
    updateStatusBar(editor.document);
    vscode.window.showInformationMessage('SecretGuard: Cleared findings for current file.');
}

export function deactivate(): void {
    diagnosticCollection?.clear();
    outputChannel?.appendLine('[SecretGuard] Deactivated.');
}
