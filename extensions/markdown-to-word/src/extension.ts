import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

let outputChannel: vscode.OutputChannel;

// Page geometry (Letter, 1" margins): usable 6.5" × 9.0", 90% constraint = 5.85" × 8.1"
const PAGE_MAX_WIDTH_IN  = 5.85;
const PAGE_MAX_HEIGHT_IN = 8.1;
// Dots per inch for reading PNG dimensions (96 DPI default for Word images)
const DPI = 96;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Markdown to Word');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('markdownToWord.convert',
            (uri?: vscode.Uri) => convertCurrent(uri, false)),
        vscode.commands.registerCommand('markdownToWord.convertWithMermaid',
            (uri?: vscode.Uri) => convertCurrent(uri, true)),
        vscode.commands.registerCommand('markdownToWord.convertWithOptions',
            (uri?: vscode.Uri) => convertWithOptions(uri)),
        vscode.commands.registerCommand('markdownToWord.preview',
            () => previewDiagrams()),
        vscode.commands.registerCommand('markdownToWord.checkPandoc',
            () => checkPandoc()),
        vscode.commands.registerCommand('markdownToWord.checkMermaid',
            () => checkMermaid())
    );

    // Activation-time check — warn if pandoc is missing
    checkPandocSilent();

    outputChannel.appendLine('[Markdown to Word] Activated.');
}

// ---------------------------------------------------------------------------
// Pandoc detection
// ---------------------------------------------------------------------------

function checkPandocSilent(): void {
    const config = vscode.workspace.getConfiguration('markdownToWord');
    const pandocPath = config.get<string>('pandocPath') ?? 'pandoc';
    cp.exec(`${pandocPath} --version`, (err) => {
        if (err) {
            vscode.window.showWarningMessage(
                'Markdown to Word: pandoc not found. Install it to enable conversion.',
                'Install Pandoc', 'Dismiss'
            ).then(c => {
                if (c === 'Install Pandoc') { vscode.env.openExternal(vscode.Uri.parse('https://pandoc.org/installing.html')); }
            });
        }
    });
}

function checkPandoc(): void {
    const config = vscode.workspace.getConfiguration('markdownToWord');
    const pandocPath = config.get<string>('pandocPath') ?? 'pandoc';
    cp.exec(`${pandocPath} --version`, (err, stdout) => {
        if (err) {
            vscode.window.showErrorMessage('❌ Pandoc not found.', 'Install Pandoc').then(c => {
                if (c) { vscode.env.openExternal(vscode.Uri.parse('https://pandoc.org/installing.html')); }
            });
        } else {
            const version = stdout.split('\n')[0];
            vscode.window.showInformationMessage(`✅ ${version}`);
        }
    });
}

function checkMermaid(): void {
    const config = vscode.workspace.getConfiguration('markdownToWord');
    const mmdcPath = config.get<string>('mmdcPath') ?? 'mmdc';
    cp.exec(`${mmdcPath} --version`, (err, stdout) => {
        if (err) {
            vscode.window.showErrorMessage('❌ Mermaid CLI (mmdc) not found.', 'Install mmdc').then(c => {
                if (c) { vscode.env.openExternal(vscode.Uri.parse('https://github.com/mermaid-js/mermaid-cli')); }
            });
        } else {
            vscode.window.showInformationMessage(`✅ Mermaid CLI: ${stdout.trim() || 'found'}`);
        }
    });
}

// ---------------------------------------------------------------------------
// Main conversion entry points
// ---------------------------------------------------------------------------

async function convertCurrent(uri?: vscode.Uri, preRenderMermaid = false): Promise<void> {
    const target = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!target || path.extname(target.fsPath).toLowerCase() !== '.md') {
        vscode.window.showWarningMessage('Open or select a Markdown file first.');
        return;
    }

    // Auto-detect Mermaid blocks and offer pre-rendering
    if (!preRenderMermaid) {
        const text = await fs.promises.readFile(target.fsPath, 'utf-8');
        const hasMermaid = /```mermaid/i.test(text);
        if (hasMermaid) {
            const choice = await vscode.window.showInformationMessage(
                'This file contains Mermaid diagrams. Pre-render them for accurate Word output?',
                'Yes — Pre-render Diagrams', 'No — Convert as-is'
            );
            if (choice === 'Yes — Pre-render Diagrams') {
                preRenderMermaid = true;
            }
        }
    }

    await convert(target.fsPath, undefined, preRenderMermaid);
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

    const renderChoice = await vscode.window.showQuickPick(
        [
            { label: '$(symbol-string) Pre-render Mermaid diagrams', value: true, description: 'Requires mmdc (mermaid-cli)' },
            { label: '$(file) Convert markdown as-is', value: false, description: 'Faster, diagrams shown as code' }
        ],
        { title: 'Mermaid Diagram Handling' }
    );

    await convert(target.fsPath, outputUri.fsPath, renderChoice?.value ?? false);
}

// ---------------------------------------------------------------------------
// Core conversion
// ---------------------------------------------------------------------------

async function convert(inputPath: string, outputPath?: string, preRenderMermaid = false): Promise<void> {
    const config = vscode.workspace.getConfiguration('markdownToWord');
    const pandocPath = config.get<string>('pandocPath') ?? 'pandoc';
    const referenceDoc = config.get<string>('referenceDoc') ?? '';
    const outPath = outputPath ?? inputPath.replace(/\.md$/, '.docx');

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'md-to-word-'));
    let workingMdPath = inputPath;
    const cleanupFiles: string[] = [];

    try {
        await vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: 'Converting to Word...', cancellable: false },
            async (progress) => {
                // Step 1: Pre-render Mermaid diagrams if requested
                if (preRenderMermaid) {
                    progress.report({ message: 'Rendering Mermaid diagrams...' });
                    workingMdPath = await preProcessMermaid(inputPath, tmpDir, config, cleanupFiles);
                }

                // Step 2: Run pandoc
                progress.report({ message: 'Running pandoc...' });
                const args = [workingMdPath, '-o', outPath, '--standalone', '--wrap=none'];

                if (referenceDoc) {
                    try {
                        await fs.promises.access(referenceDoc);
                        args.push(`--reference-doc=${referenceDoc}`);
                    } catch { /* ref doc not found */ }
                }

                await runPandoc(pandocPath, args);
            }
        );

        outputChannel.appendLine(`✅ Converted: ${outPath}`);
        vscode.window.showInformationMessage(
            `✅ Converted to ${path.basename(outPath)}`,
            'Open Folder', 'Open File'
        ).then(c => {
            if (c === 'Open Folder') { vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outPath)); }
            else if (c === 'Open File') { vscode.commands.executeCommand('vscode.open', vscode.Uri.file(outPath)); }
        });
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        vscode.window.showErrorMessage(`Conversion failed: ${error.message}`, 'Show Logs').then(c => {
            if (c) { outputChannel.show(); }
        });
        outputChannel.appendLine(`❌ Error: ${error.message}`);
        outputChannel.show();
    } finally {
        // Clean up temp files
        for (const f of cleanupFiles) {
            try { await fs.promises.unlink(f); } catch { /* ignore */ }
        }
        try { await fs.promises.rmdir(tmpDir); } catch { /* ignore */ }
    }
}

// ---------------------------------------------------------------------------
// Mermaid diagram pre-rendering
// ---------------------------------------------------------------------------

/**
 * Pre-processes the Markdown file:
 * 1. Extracts each ```mermaid block
 * 2. Renders it to PNG via mmdc
 * 3. Reads PNG dimensions to calculate optimal Word sizing (90% page coverage rule)
 * 4. Replaces the code block with a centred image reference
 * Returns path to the modified temporary Markdown file.
 */
async function preProcessMermaid(
    inputPath: string,
    tmpDir: string,
    config: vscode.WorkspaceConfiguration,
    cleanupFiles: string[]
): Promise<string> {
    const mmdcPath = config.get<string>('mmdcPath') ?? 'mmdc';
    const mmdcTheme = config.get<string>('mermaidTheme') ?? 'default';

    let markdown = await fs.promises.readFile(inputPath, 'utf-8');
    const blockRegex = /```mermaid\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    let index = 0;
    const replacements: Array<{ original: string; replacement: string }> = [];

    while ((match = blockRegex.exec(markdown)) !== null) {
        const diagramCode = match[1];
        const pngPath = path.join(tmpDir, `diagram-${index}.png`);
        const mmdPath = path.join(tmpDir, `diagram-${index}.mmd`);

        await fs.promises.writeFile(mmdPath, diagramCode, 'utf-8');
        cleanupFiles.push(mmdPath);
        cleanupFiles.push(pngPath);

        try {
            await runCommand(mmdcPath, ['-i', mmdPath, '-o', pngPath, '-t', mmdcTheme, '-b', 'white']);
            const dims = await readPngDimensions(pngPath);
            const sizeAttr = calculateImageSize(dims);
            replacements.push({
                original: match[0],
                replacement: `\n![Diagram](${pngPath})${sizeAttr}\n`
            });
            outputChannel.appendLine(`  ✅ Diagram ${index}: ${dims.width}×${dims.height}px → ${sizeAttr}`);
        } catch (err) {
            outputChannel.appendLine(`  ⚠️ Diagram ${index} failed (kept as code): ${err}`);
            // Keep original block — don't replace
        }
        index++;
    }

    for (const r of replacements) {
        markdown = markdown.replace(r.original, r.replacement);
    }

    const outMdPath = path.join(tmpDir, path.basename(inputPath));
    await fs.promises.writeFile(outMdPath, markdown, 'utf-8');
    cleanupFiles.push(outMdPath);
    return outMdPath;
}

// ---------------------------------------------------------------------------
// PNG dimension reader (no external deps — reads file header directly)
// ---------------------------------------------------------------------------

interface PngDimensions { width: number; height: number; }

async function readPngDimensions(pngPath: string): Promise<PngDimensions> {
    const buf = Buffer.alloc(24);
    const fd = await fs.promises.open(pngPath, 'r');
    try {
        await fd.read(buf, 0, 24, 0);
    } finally {
        await fd.close();
    }
    // PNG header: 8-byte signature + IHDR chunk = width at offset 16, height at 20
    if (buf.toString('ascii', 1, 4) !== 'PNG') {
        throw new Error('Not a valid PNG file');
    }
    return {
        width:  buf.readUInt32BE(16),
        height: buf.readUInt32BE(20)
    };
}

/**
 * Calculate the pandoc image size attribute using the 90% page coverage rule.
 * Page usable area: 6.5" wide × 9.0" tall (Letter, 1" margins).
 * Constraint: 5.85" × 8.1" (90%).
 */
function calculateImageSize(dims: PngDimensions): string {
    const widthIn  = dims.width  / DPI;
    const heightIn = dims.height / DPI;

    const scaleByWidth  = PAGE_MAX_WIDTH_IN  / widthIn;
    const scaleByHeight = PAGE_MAX_HEIGHT_IN / heightIn;
    const scale = Math.min(scaleByWidth, scaleByHeight, 1); // never upscale

    const constrainedWidth = widthIn * scale;
    return `{width=${constrainedWidth.toFixed(2)}in}`;
}

// ---------------------------------------------------------------------------
// Process helpers
// ---------------------------------------------------------------------------

function runPandoc(pandocPath: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = cp.spawn(pandocPath, args);
        let stderr = '';
        proc.stderr.on('data', d => { stderr += d.toString(); });
        proc.on('close', code => {
            if (code === 0) { resolve(); }
            else { reject(new Error(`Pandoc exited ${code}: ${stderr}`)); }
        });
        proc.on('error', err => {
            reject(new Error(`Could not start pandoc: ${err.message}. Install from https://pandoc.org`));
        });
    });
}

function runCommand(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = cp.spawn(cmd, args);
        let stderr = '';
        proc.stderr.on('data', d => { stderr += d.toString(); });
        proc.on('close', code => {
            if (code === 0) { resolve(); }
            else { reject(new Error(`${path.basename(cmd)} exited ${code}: ${stderr}`)); }
        });
        proc.on('error', err => {
            reject(new Error(
                `Could not start ${path.basename(cmd)}: ${err.message}. `
                + `Install with: npm install -g @mermaid-js/mermaid-cli`
            ));
        });
    });
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function previewDiagrams(): void {
    vscode.window.showInformationMessage(
        'Mermaid preview: use VS Code built-in Markdown Preview or the "Mermaid Diagram Pro" extension.'
    );
}

export function deactivate(): void {
    outputChannel?.appendLine('[Markdown to Word] Deactivated.');
}
