import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

let outputChannel: vscode.OutputChannel;
let secrets: vscode.SecretStorage;

const GAMMA_API_BASE_URL = 'https://public-api.gamma.app/v1.0';
const GAMMA_API_KEY_SECRET = 'gammaSlides.apiKey';
const GAMMA_MAX_INPUT_LENGTH = 400_000;

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
    secrets = context.secrets;
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('gammaSlides.convertToHtml', () => exportWith('html')),
        vscode.commands.registerCommand('gammaSlides.convertToPdf', () => exportWith('pdf')),
        vscode.commands.registerCommand('gammaSlides.preview', () => previewInBrowser()),
        vscode.commands.registerCommand('gammaSlides.insertFrontmatter', () => insertFrontmatter()),
        vscode.commands.registerCommand('gammaSlides.newPresentation', () => newPresentation()),
        vscode.commands.registerCommand('gammaSlides.exportToGamma', () => exportToGamma()),
        vscode.commands.registerCommand('gammaSlides.configureGammaApiKey', () => configureGammaApiKey())
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

    try {
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
        );
        vscode.window.showInformationMessage(`✅ Exported to ${path.basename(outputPath)}`, 'Open').then(c => {
            if (c) { vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath)); }
        });
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        vscode.window.showErrorMessage(`Export failed: ${error.message}\n\nInstall Marp: npm install -g @marp-team/marp-cli`);
        outputChannel.show();
    }
}

async function previewInBrowser(): Promise<void> {
    const inputPath = getActiveMarkdownPath();
    if (!inputPath) { return; }
    const outputPath = inputPath.replace(/\.md$/, '-preview.html');
    cp.exec(`npx @marp-team/marp-cli "${inputPath}" --output "${outputPath}"`, (err) => {
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

async function configureGammaApiKey(): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
        title: 'Gamma API Key',
        prompt: 'Enter an API key from gamma.app/settings/api-keys (Gamma Pro or higher required).',
        password: true,
        ignoreFocusOut: true,
        validateInput: value => value.startsWith('sk-gamma-') ? undefined : 'Gamma API keys start with sk-gamma-.'
    });
    if (apiKey === undefined) { return; }
    await secrets.store(GAMMA_API_KEY_SECRET, apiKey.trim());
    vscode.window.showInformationMessage('Gamma Slides: API key saved in VS Code SecretStorage.');
}

async function exportToGamma(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage('Open a Markdown presentation first.');
        return;
    }

    const apiKey = await secrets.get(GAMMA_API_KEY_SECRET);
    if (!apiKey) {
        const choice = await vscode.window.showWarningMessage(
            'Gamma generation requires a Gamma Pro-or-higher API key and may consume Gamma credits.',
            'Configure API Key',
            'Open Gamma API Docs'
        );
        if (choice === 'Configure API Key') {
            await configureGammaApiKey();
        } else if (choice === 'Open Gamma API Docs') {
            vscode.env.openExternal(vscode.Uri.parse('https://developers.gamma.app'));
        }
        return;
    }

    const inputText = toGammaInput(editor.document.getText());
    if (!inputText.trim()) {
        vscode.window.showWarningMessage('Gamma Slides: The presentation has no content after Marp frontmatter.');
        return;
    }
    if (inputText.length > GAMMA_MAX_INPUT_LENGTH) {
        vscode.window.showErrorMessage(`Gamma Slides: Input exceeds Gamma's ${GAMMA_MAX_INPUT_LENGTH.toLocaleString()} character limit.`);
        return;
    }

    const confirmed = await vscode.window.showWarningMessage(
        'Generate this presentation in Gamma? Gamma will process the text and may consume API credits.',
        { modal: true },
        'Generate in Gamma'
    );
    if (confirmed !== 'Generate in Gamma') { return; }

    try {
        const result = await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Generating presentation in Gamma',
                cancellable: true
            },
            async (progress, token) => {
                progress.report({ message: 'Submitting Markdown content...' });
                const generationId = await createGammaGeneration(apiKey, inputText);
                return pollGammaGeneration(apiKey, generationId, progress, token);
            }
        );

        if (result.cancelled) {
            vscode.window.showInformationMessage('Gamma Slides: Generation polling cancelled. Gamma may continue processing in the background.');
            return;
        }

        outputChannel.appendLine(`Gamma presentation ready: ${result.gammaUrl}`);
        vscode.window.showInformationMessage('Gamma presentation ready.', 'Open in Gamma').then(choice => {
            if (choice === 'Open in Gamma') {
                vscode.env.openExternal(vscode.Uri.parse(result.gammaUrl));
            }
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        outputChannel.appendLine(`Gamma generation failed: ${message}`);
        vscode.window.showErrorMessage(`Gamma Slides: ${message}`, 'Show Logs').then(choice => {
            if (choice === 'Show Logs') { outputChannel.show(); }
        });
    }
}

function toGammaInput(markdown: string): string {
    const normalized = markdown.replace(/\r\n/g, '\n');
    if (!normalized.startsWith('---\n')) {
        return normalized.trim();
    }
    const frontmatterEnd = normalized.indexOf('\n---\n', 4);
    return frontmatterEnd >= 0 ? normalized.slice(frontmatterEnd + 5).trim() : normalized.trim();
}

async function createGammaGeneration(apiKey: string, inputText: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('gammaSlides');
    const defaultThemeId = config.get<string>('defaultThemeId')?.trim();
    const estimatedCards = Math.min(Math.max(inputText.split(/\n---\n/).length, 1), 60);
    const body: Record<string, unknown> = {
        inputText,
        textMode: 'preserve',
        format: 'presentation',
        cardSplit: 'inputTextBreaks',
        numCards: estimatedCards,
        title: vscode.window.activeTextEditor?.document.fileName ? path.basename(vscode.window.activeTextEditor.document.fileName, '.md') : undefined,
        additionalInstructions: 'Preserve the supplied content. Use the horizontal-rule card breaks as presentation boundaries.'
    };
    if (defaultThemeId) {
        body.themeId = defaultThemeId;
    }

    const response = await fetch(`${GAMMA_API_BASE_URL}/generations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(await gammaErrorMessage(response));
    }

    const payload = await response.json() as { generationId?: string };
    if (!payload.generationId) {
        throw new Error('Gamma did not return a generation ID.');
    }
    return payload.generationId;
}

async function pollGammaGeneration(
    apiKey: string,
    generationId: string,
    progress: vscode.Progress<{ message?: string; increment?: number }>,
    token: vscode.CancellationToken
): Promise<{ gammaUrl: string; cancelled: boolean }> {
    for (let attempt = 0; attempt < 120; attempt++) {
        if (token.isCancellationRequested) {
            return { gammaUrl: '', cancelled: true };
        }

        await delay(5_000);
        progress.report({ message: `Gamma is creating the presentation (${attempt + 1}/120)...` });
        const response = await fetch(`${GAMMA_API_BASE_URL}/generations/${generationId}`, {
            headers: { 'X-API-KEY': apiKey }
        });
        if (!response.ok) {
            throw new Error(await gammaErrorMessage(response));
        }

        const payload = await response.json() as { status?: string; gammaUrl?: string; error?: string };
        if (payload.status === 'completed' && payload.gammaUrl) {
            return { gammaUrl: payload.gammaUrl, cancelled: false };
        }
        if (payload.status === 'failed') {
            throw new Error(payload.error || 'Gamma could not generate the presentation.');
        }
    }
    throw new Error('Gamma generation timed out after 10 minutes. Check Gamma for a completed presentation before retrying.');
}

async function gammaErrorMessage(response: Response): Promise<string> {
    const detail = await response.text();
    if (response.status === 401) {
        return 'Gamma rejected the API key. Configure a valid key from gamma.app/settings/api-keys.';
    }
    if (response.status === 403) {
        return 'Gamma denied the request. Confirm your account has a Pro-or-higher API plan and available credits.';
    }
    if (response.status === 429) {
        return 'Gamma rate limit reached. Wait before trying another generation.';
    }
    return `Gamma API request failed (${response.status}): ${detail || response.statusText}`;
}

function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function deactivate(): void {
    outputChannel?.appendLine('[Gamma Slide Assistant] Deactivated.');
}
