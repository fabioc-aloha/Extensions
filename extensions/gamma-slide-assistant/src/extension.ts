import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

let outputChannel: vscode.OutputChannel;

const MARP_FRONTMATTER = `---
marp: true
theme: default
paginate: true
backgroundColor: '#ffffff'
color: '#333333'
---

`;

const STARTER_PRESENTATION = `---
marp: true
theme: default
paginate: true
backgroundColor: '#1a1a2e'
color: '#eaeaea'
---

# Presentation Title
## Subtitle or Author

---

## Slide 2: Key Points

- 🔹 First important point
- 🔹 Second important point  
- 🔹 Third important point

---

## Slide 3: Code Example

\`\`\`typescript
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}
\`\`\`

---

## Slide 4: Summary

> "A great presentation tells a story."

Thank you!
`;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Gamma Slide Assistant');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('gammaSlides.convertToHtml', () => exportWith('html')),
        vscode.commands.registerCommand('gammaSlides.convertToPdf', () => exportWith('pdf')),
        vscode.commands.registerCommand('gammaSlides.preview', () => previewInBrowser()),
        vscode.commands.registerCommand('gammaSlides.insertFrontmatter', () => insertFrontmatter()),
        vscode.commands.registerCommand('gammaSlides.newPresentation', () => newPresentation())
    );

    outputChannel.appendLine('[Gamma Slide Assistant] Activated. Powered by Marp.');
}

function getActiveMarkdownPath(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage('Open a Markdown (.md) file first.');
        return null;
    }
    return editor.document.uri.fsPath;
}

async function exportWith(format: 'html' | 'pdf'): Promise<void> {
    const inputPath = getActiveMarkdownPath();
    if (!inputPath) { return; }
    const ext = format === 'html' ? '.html' : '.pdf';
    const outputPath = inputPath.replace(/\.md$/, ext);

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Exporting as ${format.toUpperCase()}...`, cancellable: false },
        () => new Promise<void>((resolve, reject) => {
            const proc = cp.spawn('npx', ['@marp-team/marp-cli', inputPath, '--output', outputPath], { shell: true });
            let stderr = '';
            proc.stderr?.on('data', d => { stderr += d.toString(); });
            proc.on('close', code => {
                if (code === 0) {
                    outputChannel.appendLine(`✅ Exported: ${outputPath}`);
                    resolve();
                } else {
                    outputChannel.appendLine(`❌ Marp error: ${stderr}`);
                    reject(new Error(stderr || 'Marp export failed'));
                }
            });
            proc.on('error', () => reject(new Error('npx not found. Install Node.js.')));
        })
    ).then(() => {
        vscode.window.showInformationMessage(`✅ Exported to ${path.basename(outputPath)}`, 'Open').then(c => {
            if (c) { vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath)); }
        });
    }).catch(err => {
        vscode.window.showErrorMessage(`Export failed: ${err.message}\n\nInstall Marp: npm install -g @marp-team/marp-cli`);
        outputChannel.show();
    });
}

async function previewInBrowser(): Promise<void> {
    const inputPath = getActiveMarkdownPath();
    if (!inputPath) { return; }
    const outputPath = inputPath.replace(/\.md$/, '-preview.html');
    cp.exec(`npx @marp-team/marp-cli "${inputPath}" --output "${outputPath}"`, { shell: true as boolean }, (err) => {
        if (err) {
            vscode.window.showErrorMessage('Marp not available. Install: npm install -g @marp-team/marp-cli');
            return;
        }
        vscode.env.openExternal(vscode.Uri.file(outputPath));
    });
}

function insertFrontmatter(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    editor.edit(eb => eb.insert(new vscode.Position(0, 0), MARP_FRONTMATTER));
}

async function newPresentation(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) { return; }
    const name = await vscode.window.showInputBox({ title: 'Presentation Name', value: 'presentation' });
    if (!name) { return; }
    const uri = vscode.Uri.file(path.join(workspaceRoot, `${name}.md`));
    await vscode.workspace.fs.writeFile(uri, Buffer.from(STARTER_PRESENTATION));
    vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}

export function deactivate(): void {
    outputChannel?.appendLine('[Gamma Slide Assistant] Deactivated.');
}
