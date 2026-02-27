import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let outputChannel: vscode.OutputChannel;

/** Standard banner dimensions for VS Code Marketplace extension banners */
const BANNER_WIDTH = 1280;

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
        ),
        vscode.commands.registerCommand('svgToPng.generateBanners', () =>
            generateExtensionBanners()
        ),
        vscode.commands.registerCommand('svgToPng.convertTransparent', (uri?: vscode.Uri) =>
            convertSvg(uri, false, true)
        )
    );

    outputChannel.appendLine('[SVG to PNG] Activated — powered by resvg-js (Rust).');
}

async function convertSvg(uri?: vscode.Uri, askWidth = false, transparent = false): Promise<void> {
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
    const success = await doConvert(targetUri.fsPath, outputPath, width, transparent);

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

/**
 * Generate extension banners — scans extensions/{name}/assets/banner.svg at 1280px width.
 * Follows the monorepo banner pipeline from the svg-to-png skill.
 */
async function generateExtensionBanners(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
        vscode.window.showWarningMessage('No workspace open.');
        return;
    }

    const bannerPattern = new vscode.RelativePattern(workspaceRoot, 'extensions/*/assets/banner.svg');
    const bannerFiles = await vscode.workspace.findFiles(bannerPattern);

    if (bannerFiles.length === 0) {
        vscode.window.showInformationMessage(
            'No banner SVGs found at extensions/*/assets/banner.svg',
            'Create Banners Guide'
        ).then(c => {
            if (c) {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/microsoft/vscode/wiki/Extension-Gallery#banner'));
            }
        });
        return;
    }

    const confirm = await vscode.window.showInformationMessage(
        `Generate ${bannerFiles.length} extension banner(s) at ${BANNER_WIDTH}px?`,
        { modal: true },
        `Generate All (${BANNER_WIDTH}px)`
    );
    if (!confirm) { return; }

    let successCount = 0;
    let failCount = 0;

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Generating Extension Banners...', cancellable: false },
        async (progress) => {
            for (let i = 0; i < bannerFiles.length; i++) {
                const svgPath = bannerFiles[i].fsPath;
                const pngPath = svgPath.replace(/\.svg$/i, '.png');
                const extName = path.basename(path.dirname(path.dirname(svgPath)));

                progress.report({
                    message: `${i + 1}/${bannerFiles.length}: ${extName}`,
                    increment: 100 / bannerFiles.length
                });

                const ok = await doConvert(svgPath, pngPath, BANNER_WIDTH);
                ok ? successCount++ : failCount++;
            }
        }
    );

    outputChannel.appendLine(`\n🎨 Banner Pipeline Summary:`);
    outputChannel.appendLine(`   ✅ ${successCount} banner(s) generated at ${BANNER_WIDTH}px`);
    if (failCount > 0) { outputChannel.appendLine(`   ❌ ${failCount} failed (see above)`); }
    outputChannel.show();

    vscode.window.showInformationMessage(
        `✅ ${successCount} banner(s) ready at ${BANNER_WIDTH}px` + (failCount > 0 ? `, ${failCount} failed` : ''),
        'Show Logs'
    ).then(c => { if (c) { outputChannel.show(); } });
}

async function doConvert(svgPath: string, pngPath: string, width: number, transparent = false): Promise<boolean> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { Resvg } = require('@resvg/resvg-js');

        const svgBuffer = await fs.promises.readFile(svgPath);
        const config = vscode.workspace.getConfiguration('svgToPng');
        const opts: Record<string, unknown> = {
            font: {
                loadSystemFonts: config.get<boolean>('loadSystemFonts') ?? true
            }
        };

        if (!transparent) {
            opts['background'] = 'rgba(255,255,255,1)'; // white background by default
        }

        if (width > 0) {
            opts['fitTo'] = { mode: 'width', value: width };
        }

        const resvg = new Resvg(svgBuffer, opts);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        await fs.promises.writeFile(pngPath, pngBuffer);

        const msg = `✅ ${path.basename(svgPath)} → ${path.basename(pngPath)} (${pngData.width}×${pngData.height}px)`;
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

