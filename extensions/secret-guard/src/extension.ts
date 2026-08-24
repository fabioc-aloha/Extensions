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
        vscode.commands.registerCommand('secretGuard.scanWorkspace', scanWorkspace),
        vscode.commands.registerCommand('secretGuard.scanFile', (uri?: vscode.Uri) => scanCurrentFile(uri)),
        vscode.commands.registerCommand('secretGuard.viewReport', () => outputChannel.show()),
        vscode.commands.registerCommand('secretGuard.addIgnorePattern', addIgnorePattern),
        vscode.commands.registerCommand('secretGuard.clearFile', clearCurrentFile),
        vscode.workspace.onDidChangeTextDocument(event => {
            const config = vscode.workspace.getConfiguration('secretGuard');
            if (!config.get('enabled') || !config.get('scanOnType') || isIgnored(event.document.uri)) {
                return;
            }
            if (scanDebounce) {
                clearTimeout(scanDebounce);
            }
            scanDebounce = setTimeout(() => {
                scanDocument(event.document);
                updateStatusBar(event.document);
            }, 600);
        }),
        vscode.workspace.onDidSaveTextDocument(document => {
            const config = vscode.workspace.getConfiguration('secretGuard');
            if (config.get('enabled') && config.get('scanOnSave') && !isIgnored(document.uri)) {
                scanDocument(document);
                updateStatusBar(document);
            }
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => updateStatusBar(editor?.document))
    );

    const active = vscode.window.activeTextEditor?.document;
    if (active && vscode.workspace.getConfiguration('secretGuard').get('enabled') && !isIgnored(active.uri)) {
        scanDocument(active);
    }
    updateStatusBar(active);
    outputChannel.appendLine('[SecretGuard] Activated. Scans run locally and findings are redacted in the audit log.');
}

async function scanWorkspace(): Promise<void> {
    const ignorePatterns = getIgnorePatterns();
    const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,out,dist,build}/**');
    let totalFindings = 0;
    let scannedFiles = 0;
    diagnosticCollection.clear();

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'SecretGuard: Scanning workspace...', cancellable: false },
        async progress => {
            for (let index = 0; index < files.length; index++) {
                const uri = files[index];
                progress.report({ increment: files.length ? 100 / files.length : 100, message: path.basename(uri.fsPath) });
                if (matchesIgnorePattern(uri, ignorePatterns)) {
                    continue;
                }
                try {
                    const document = await vscode.workspace.openTextDocument(uri);
                    totalFindings += scanDocument(document);
                    scannedFiles += 1;
                } catch {
                    // Ignore binary and unreadable files.
                }
            }
        }
    );

    updateStatusBar(vscode.window.activeTextEditor?.document);
    const message = totalFindings === 0
        ? `SecretGuard: no potential secrets in ${scannedFiles} scanned text file(s).`
        : `SecretGuard: ${totalFindings} potential secret(s) in ${scannedFiles} scanned text file(s). Check Problems.`;
    vscode.window.showInformationMessage(message, 'View Report').then(choice => {
        if (choice === 'View Report') {
            outputChannel.show();
        }
    });
}

async function scanCurrentFile(uri?: vscode.Uri): Promise<void> {
    const document = uri
        ? await vscode.workspace.openTextDocument(uri)
        : vscode.window.activeTextEditor?.document;
    if (!document) {
        vscode.window.showInformationMessage('SecretGuard: no active editor.');
        return;
    }
    if (isIgnored(document.uri)) {
        diagnosticCollection.delete(document.uri);
        updateStatusBar(document);
        vscode.window.showInformationMessage('SecretGuard: this file matches a local ignore pattern.');
        return;
    }
    const count = scanDocument(document);
    updateStatusBar(document);
    vscode.window.showInformationMessage(
        count ? `SecretGuard: ${count} potential secret(s) found. Check Problems.` : 'SecretGuard: no potential secrets found in the current file.'
    );
}

function scanDocument(document: vscode.TextDocument): number {
    if (isIgnored(document.uri)) {
        diagnosticCollection.delete(document.uri);
        return 0;
    }
    const findings = scanner.scan(document.getText(), document.fileName);
    const diagnostics = findings.map(finding => {
        const line = Math.max(0, finding.line - 1);
        const lineText = document.lineAt(Math.min(line, document.lineCount - 1)).text;
        const range = new vscode.Range(line, 0, line, lineText.length);
        const severity = finding.severity === 'critical'
            ? vscode.DiagnosticSeverity.Error
            : vscode.DiagnosticSeverity.Warning;
        const diagnostic = new vscode.Diagnostic(
            range,
            `[SecretGuard] ${finding.patternName}: potential secret detected`,
            severity
        );
        diagnostic.source = 'SecretGuard';
        outputChannel.appendLine(`[${finding.severity.toUpperCase()}] ${document.fileName}:${finding.line} — ${finding.patternName}`);
        return diagnostic;
    });

    if (diagnostics.length) {
        diagnosticCollection.set(document.uri, diagnostics);
    } else {
        diagnosticCollection.delete(document.uri);
    }
    return findings.length;
}

async function addIgnorePattern(): Promise<void> {
    const pattern = await vscode.window.showInputBox({
        title: 'SecretGuard: Add Local Ignore Pattern',
        prompt: 'Ignore a workspace-relative glob, for example **/*.fixture.ts or docs/examples/**',
        validateInput: value => value.trim() ? undefined : 'Enter a glob pattern.'
    });
    if (!pattern) {
        return;
    }
    const config = vscode.workspace.getConfiguration('secretGuard');
    const existing = config.get<string[]>('ignorePatterns') ?? [];
    if (existing.includes(pattern)) {
        vscode.window.showInformationMessage(`SecretGuard: "${pattern}" is already ignored.`);
        return;
    }
    await config.update('ignorePatterns', [...existing, pattern], vscode.ConfigurationTarget.Workspace);
    outputChannel.appendLine(`[SecretGuard] Added local ignore pattern: ${pattern}`);
    vscode.window.showInformationMessage(`SecretGuard: added local ignore pattern "${pattern}".`);
}

function getIgnorePatterns(): string[] {
    return vscode.workspace.getConfiguration('secretGuard').get<string[]>('ignorePatterns') ?? [];
}

function isIgnored(uri: vscode.Uri): boolean {
    return matchesIgnorePattern(uri, getIgnorePatterns());
}

function matchesIgnorePattern(uri: vscode.Uri, patterns: readonly string[]): boolean {
    if (uri.scheme !== 'file') {
        return false;
    }
    const relativePath = vscode.workspace.asRelativePath(uri, false).replace(/\\/g, '/');
    return patterns.some(pattern => globToRegExp(pattern).test(relativePath));
}

function globToRegExp(glob: string): RegExp {
    let expression = '^';
    for (let index = 0; index < glob.length; index++) {
        const character = glob[index];
        const next = glob[index + 1];
        if (character === '*' && next === '*') {
            if (glob[index + 2] === '/') {
                expression += '(?:.*/)?';
                index += 2;
            } else {
                expression += '.*';
                index += 1;
            }
        } else if (character === '*') {
            expression += '[^/]*';
        } else if (character === '?') {
            expression += '[^/]';
        } else {
            expression += character.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
        }
    }
    return new RegExp(`${expression}$`, 'i');
}

function updateStatusBar(document?: vscode.TextDocument): void {
    const target = document ?? vscode.window.activeTextEditor?.document;
    if (!target || target.uri.scheme !== 'file' || isIgnored(target.uri)) {
        statusBar.hide();
        return;
    }
    const count = diagnosticCollection.get(target.uri)?.length ?? 0;
    statusBar.text = count
        ? `$(warning) ${count} secret${count === 1 ? '' : 's'}`
        : '$(shield) SecretGuard';
    statusBar.tooltip = count
        ? `SecretGuard: ${count} potential secret(s) in the current file. Click for the local audit log.`
        : 'SecretGuard: no findings in the current file. Click for the local audit log.';
    statusBar.backgroundColor = count ? new vscode.ThemeColor('statusBarItem.warningBackground') : undefined;
    statusBar.show();
}

function clearCurrentFile(): void {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) {
        return;
    }
    diagnosticCollection.delete(document.uri);
    updateStatusBar(document);
    vscode.window.showInformationMessage('SecretGuard: cleared current-file findings. They will be recalculated on the next scan.');
}

export function deactivate(): void {
    if (scanDebounce) {
        clearTimeout(scanDebounce);
    }
    diagnosticCollection?.clear();
}
