import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('SVG to PNG');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('svgToPng.convert', (uri?: vscode.Uri) =>
            convertSvg(uri)
        ),
        vscode.commands.registerCommand('svgToPng.convertWithWidth', (uri?: vscode.Uri) =>
            convertSvg(uri, true)
        ),
        vscode.commands.registerCommand('svgToPng.convertBatch', () =>
            convertBatch()
        )
    );

    outputChannel.appendLine('[SVG to PNG] Activated — powered by resvg-js (Rust).');
}

async function convertSvg(uri?: vscode.Uri, askWidth = false): Promise<void> {
    const targetUri = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!targetUri || path.extname(targetUri.fsPath).toLowerCase() !== '.svg') {
        vscode.window.showWarningMessage('SVG to PNG: No SVG file selected.');
        return;
    }

    const config = vscode.workspace.getConfiguration('svgToPng');
    let width: number = config.get<number>('defaultWidth') ?? 0;

    if (askWidth) {
        const input = await vscode.window.showInputBox({
            title: 'SVG to PNG: Output Width',
            prompt: 'Enter output width in pixels (leave empty for natural SVG size)',
            value: width > 0 ? String(width) : '',
            validateInput: v => (!v || /^\d+$/.test(v)) ? undefined : 'Enter a positive integer or leave empty'
        });
        if (input === undefined) { return; } // cancelled
        width = input ? parseInt(input, 10) : 0;
    }

    const outputPath = targetUri.fsPath.replace(/\.svg$/i, '.png');
    const success = await doConvert(targetUri.fsPath, outputPath, width);

    if (success && config.get<boolean>('openAfterConvert')) {
        const pngUri = vscode.Uri.file(outputPath);
        await vscode.commands.executeCommand('vscode.open', pngUri);
    }
}

async function convertBatch(): Promise<void> {
    const svgFiles = await vscode.workspace.findFiles('**/*.svg', '**/node_modules/**');
    if (svgFiles.length === 0) {
        vscode.window.showInformationMessage('SVG to PNG: No SVG files found in workspace.');
        return;
    }

    const confirm = await vscode.window.showInformationMessage(
        `SVG to PNG: Convert ${svgFiles.length} SVG file(s) to PNG?`,
        { modal: true },
        'Convert All'
    );
    if (confirm !== 'Convert All') { return; }

    const config = vscode.workspace.getConfiguration('svgToPng');
    const width: number = config.get<number>('defaultWidth') ?? 0;

    let successCount = 0;
    let failCount = 0;

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'SVG to PNG', cancellable: false },
        async (progress) => {
            for (let i = 0; i < svgFiles.length; i++) {
                const svgPath = svgFiles[i].fsPath;
                const pngPath = svgPath.replace(/\.svg$/i, '.png');
                progress.report({
                    message: `Converting ${i + 1}/${svgFiles.length}: ${path.basename(svgPath)}`,
                    increment: (100 / svgFiles.length)
                });
                const ok = await doConvert(svgPath, pngPath, width);
                ok ? successCount++ : failCount++;
            }
        }
    );

    const msg = `SVG to PNG: ${successCount} converted` + (failCount > 0 ? `, ${failCount} failed` : '') + '.';
    vscode.window.showInformationMessage(msg);
    outputChannel.show();
}

async function doConvert(svgPath: string, pngPath: string, width: number): Promise<boolean> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { Resvg } = require('@resvg/resvg-js');

        const svgBuffer = await fs.promises.readFile(svgPath);
        const opts: Record<string, unknown> = {
            font: {
                loadSystemFonts: vscode.workspace.getConfiguration('svgToPng').get<boolean>('loadSystemFonts') ?? true
            }
        };

        if (width > 0) {
            opts['fitTo'] = { mode: 'width', value: width };
        }

        const resvg = new Resvg(svgBuffer, opts);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        await fs.promises.writeFile(pngPath, pngBuffer);

        const msg = `✅ ${path.basename(svgPath)} → ${path.basename(pngPath)} (${pngData.width}×${pngData.height})`;
        outputChannel.appendLine(msg);
        return true;
    } catch (err) {
        const msg = `❌ Failed: ${path.basename(svgPath)} — ${err instanceof Error ? err.message : String(err)}`;
        outputChannel.appendLine(msg);
        vscode.window.showErrorMessage(`SVG to PNG: ${msg}`);
        return false;
    }
}

export function deactivate(): void {}
