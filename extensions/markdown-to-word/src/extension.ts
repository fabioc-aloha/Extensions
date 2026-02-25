import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as fs from 'fs';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Markdown to Word');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('markdownToWord.convert', (uri?: vscode.Uri) => convertCurrent(uri)),
        vscode.commands.registerCommand('markdownToWord.convertWithOptions', (uri?: vscode.Uri) => convertWithOptions(uri)),
        vscode.commands.registerCommand('markdownToWord.preview', () => previewDiagrams()),
        vscode.commands.registerCommand('markdownToWord.checkPandoc', () => checkPandoc())
    );

    outputChannel.appendLine('[Markdown to Word] Activated.');
}

async function convertCurrent(uri?: vscode.Uri): Promise<void> {
    const target = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!target || path.extname(target.fsPath).toLowerCase() !== '.md') {
        vscode.window.showWarningMessage('Open or select a Markdown file first.');
        return;
    }
    await convert(target.fsPath);
}

async function convertWithOptions(uri?: vscode.Uri): Promise<void> {
    const target = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!target || path.extname(target.fsPath).toLowerCase() !== '.md') {
        vscode.window.showWarningMessage('Open or select a Markdown file first.');
        return;
    }
    const outputUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(target.fsPath.replace(/\.md$/, '.docx')),
        filters: { 'Word Document': ['docx'] }
    });
    if (!outputUri) { return; }
    await convert(target.fsPath, outputUri.fsPath);
}

async function convert(inputPath: string, outputPath?: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('markdownToWord');
    const pandocPath = config.get<string>('pandocPath') ?? 'pandoc';
    const referenceDoc = config.get<string>('referenceDoc') ?? '';
    const outPath = outputPath ?? inputPath.replace(/\.md$/, '.docx');

    const args = [inputPath, '-o', outPath, '--standalone'];
    if (referenceDoc) {
        try { await fs.promises.access(referenceDoc); args.push(`--reference-doc=${referenceDoc}`); } catch { /* ref doc not found, skip */ }
    }

    try {
        await vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: 'Converting to Word...', cancellable: false },
            () => new Promise<void>((resolve, reject) => {
                const proc = cp.spawn(pandocPath, args);
                let stderr = '';
                proc.stderr.on('data', d => { stderr += d.toString(); });
                proc.on('close', code => {
                    if (code === 0) {
                        outputChannel.appendLine(`✅ Converted: ${outPath}`);
                        resolve();
                    } else {
                        outputChannel.appendLine(`❌ Pandoc error: ${stderr}`);
                        reject(new Error(stderr));
                    }
                });
                proc.on('error', err => { reject(new Error(`Could not run pandoc: ${err.message}. Install from https://pandoc.org`)); });
            })
        );
        vscode.window.showInformationMessage(`✅ Converted to ${path.basename(outPath)}`, 'Open Folder').then(c => {
            if (c) { vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outPath)); }
        });
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        vscode.window.showErrorMessage(`Conversion failed: ${error.message}`);
        outputChannel.show();
    }
}

function previewDiagrams(): void {
    vscode.window.showInformationMessage('Mermaid preview: use the built-in Markdown Preview or install Mermaid Preview extension.');
}

function checkPandoc(): void {
    const config = vscode.workspace.getConfiguration('markdownToWord');
    const pandocPath = config.get<string>('pandocPath') ?? 'pandoc';
    cp.exec(`${pandocPath} --version`, (err, stdout) => {
        if (err) {
            vscode.window.showErrorMessage(`Pandoc not found. Install from https://pandoc.org`);
        } else {
            const version = stdout.split('\n')[0];
            vscode.window.showInformationMessage(`✅ ${version}`);
        }
    });
}

export function deactivate(): void {
    outputChannel?.appendLine('[Markdown to Word] Deactivated.');
}
