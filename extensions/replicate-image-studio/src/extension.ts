import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ReplicateClient, MODEL_CATALOG, selectModelForPrompt, type SupportedModel } from '@alex-extensions/shared';

let outputChannel: vscode.OutputChannel;
let client: ReplicateClient | null = null;

interface HistoryEntry {
    prompt: string;
    urls: string[];
    model: SupportedModel;
    aspectRatio?: string;
    createdAt: string;
}

let history: HistoryEntry[] = [];
const HISTORY_KEY = 'replicate.history';
const MAX_HISTORY_ENTRIES = 50;

const ASPECT_RATIOS = [
    { label: '1:1  Square', value: '1:1' },
    { label: '16:9  Landscape (banner, wallpaper)', value: '16:9' },
    { label: '9:16  Portrait (mobile, story)', value: '9:16' },
    { label: '4:3  Classic landscape', value: '4:3' },
    { label: '3:4  Classic portrait', value: '3:4' },
    { label: '3:2  Photo landscape', value: '3:2' },
];

function getSelectedText(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return ''; }
    return editor.document.getText(editor.selection).trim();
}

function requireClient(): ReplicateClient | null {
    if (!client) {
        vscode.window.showErrorMessage('Set your Replicate API key first.', 'Set API Key').then(c => {
            if (c) { vscode.commands.executeCommand('replicateStudio.setApiKey'); }
        });
        return null;
    }
    return client;
}

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Replicate Image Studio');
    context.subscriptions.push(outputChannel);
    history = context.globalState.get<HistoryEntry[]>(HISTORY_KEY, []);

    // Initialize client from stored key
    context.secrets.get('replicate.apiKey').then(key => {
        if (key) { client = new ReplicateClient(key); }
    });

    // Watch for secret changes (e.g. first-time setup)
    context.subscriptions.push(
        context.secrets.onDidChange(e => {
            if (e.key === 'replicate.apiKey') {
                context.secrets.get('replicate.apiKey').then(key => {
                    client = key ? new ReplicateClient(key) : null;
                });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('replicateStudio.generate',
            () => generateImage(context, getSelectedText())),
        vscode.commands.registerCommand('replicateStudio.generateSmart',
            () => generateSmart(context)),
        vscode.commands.registerCommand('replicateStudio.generateBanner',
            () => generateBanner(context)),
        vscode.commands.registerCommand('replicateStudio.generateVideo',
            () => generateVideo(context, getSelectedText())),
        vscode.commands.registerCommand('replicateStudio.setApiKey',
            () => setApiKey(context)),
        vscode.commands.registerCommand('replicateStudio.viewHistory',
            () => viewHistory()),
        vscode.commands.registerCommand('replicateStudio.insertMarkdown',
            () => insertLastImage()),
        vscode.commands.registerCommand('replicateStudio.saveToFile',
            () => saveLastToFile())
    );

    outputChannel.appendLine('[Replicate Image Studio] Activated — 7 models available.');
}

async function setApiKey(context: vscode.ExtensionContext): Promise<void> {
    const key = await vscode.window.showInputBox({
        title: 'Replicate API Key',
        password: true,
        prompt: 'Get your key at replicate.com/account/api-tokens'
    });
    if (key) {
        await context.secrets.store('replicate.apiKey', key);
        client = new ReplicateClient(key);
        vscode.window.showInformationMessage('✅ API key saved.');
    }
}

async function generateImage(context: vscode.ExtensionContext, selectedText = ''): Promise<void> {
    const c = requireClient();
    if (!c) { return; }

    // Build QuickPick items from MODEL_CATALOG (cheapest first)
    const modelOrder: SupportedModel[] = [
        'flux-schnell', 'sdxl', 'flux-dev', 'flux-pro',
        'ideogram-turbo', 'ideogram', 'seedream'
    ];
    const modelItems = modelOrder.map(key => {
        const m = MODEL_CATALOG[key];
        return {
            label: m.label,
            description: m.cost,
            detail: `${m.bestFor}${m.textRendering ? '  ✍️ Text rendering' : ''}`,
            modelKey: key as SupportedModel
        };
    });

    const model = await vscode.window.showQuickPick(modelItems, {
        title: 'Choose Model',
        matchOnDescription: true,
        matchOnDetail: true
    });
    if (!model) { return; }

    const prompt = await vscode.window.showInputBox({
        title: 'Image Prompt',
        prompt: 'Describe the image you want to generate',
        value: selectedText
    });
    if (!prompt) { return; }

    const aspectRatio = await vscode.window.showQuickPick(ASPECT_RATIOS, {
        title: 'Aspect Ratio',
        placeHolder: 'Choose output aspect ratio'
    });
    if (!aspectRatio) { return; }

    const negativePrompt = await getNegativePrompt();
    await runGeneration(context, c, model.modelKey, prompt, aspectRatio.value, undefined, negativePrompt);
}

async function generateSmart(context: vscode.ExtensionContext): Promise<void> {
    const c = requireClient();
    if (!c) { return; }

    const selectedText = getSelectedText();
    const prompt = await vscode.window.showInputBox({
        title: 'Smart Generate — AI selects best model',
        prompt: 'Describe your image. Include words like "banner", "logo", "photo" to guide model selection.',
        value: selectedText
    });
    if (!prompt) { return; }

    const aspectRatio = await vscode.window.showQuickPick(ASPECT_RATIOS, {
        title: 'Aspect Ratio'
    });
    if (!aspectRatio) { return; }

    const selectedModel = selectModelForPrompt(prompt);
    const modelInfo = MODEL_CATALOG[selectedModel];

    const negativePrompt = await getNegativePrompt();
    await runGeneration(context, c, selectedModel, prompt, aspectRatio.value,
        `Smart mode selected: ${modelInfo.label} — ${modelInfo.bestFor}`, negativePrompt);
}

async function generateBanner(context: vscode.ExtensionContext): Promise<void> {
    const c = requireClient();
    if (!c) { return; }

    const prompt = await vscode.window.showInputBox({
        title: 'README Banner Generator',
        prompt: 'Describe your project banner (Ideogram v2 auto-selected for text rendering)',
        value: getSelectedText() || 'Professional software extension banner with project name and dark gradient background'
    });
    if (!prompt) { return; }

    // Banners are always landscape + Ideogram for typography
    const negativePrompt = await getNegativePrompt();
    await runGeneration(context, c, 'ideogram', prompt, '16:9', 'Banner mode: Ideogram v2 selected for text rendering', negativePrompt);
}

async function generateVideo(context: vscode.ExtensionContext, selectedText = ''): Promise<void> {
    const c = requireClient();
    if (!c) { return; }

    const prompt = await vscode.window.showInputBox({
        title: 'Video Generation (WAN 2.1)',
        prompt: 'Describe the video scene',
        value: selectedText
    });
    if (!prompt) { return; }

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Generating video (2-5 min)...', cancellable: true },
        async (_progress, token) => {
            const controller = new AbortController();
            token.onCancellationRequested(() => controller.abort());
            try {
                const urls = await c.generate('wan-2-1', { prompt }, controller.signal);
                const url = urls[0] ?? '';
                await addHistory(context, { prompt, urls, model: 'wan-2-1', createdAt: new Date().toISOString() });
                outputChannel.appendLine(`✅ Video generated: ${url}`);
                vscode.window.showInformationMessage('✅ Video generated!', 'Open in Browser').then(action => {
                    if (action && url) { vscode.env.openExternal(vscode.Uri.parse(url)); }
                });
            } catch (err) {
                if (token.isCancellationRequested) {
                    vscode.window.showInformationMessage('Replicate video generation cancelled.');
                    return;
                }
                vscode.window.showErrorMessage(`Video generation failed: ${err}`);
                outputChannel.appendLine(`❌ Video error: ${err}`);
            }
        }
    );
}

async function runGeneration(
    context: vscode.ExtensionContext,
    c: ReplicateClient,
    modelKey: SupportedModel,
    prompt: string,
    aspectRatio: string,
    statusNote?: string,
    negativePrompt?: string
): Promise<void> {
    const modelInfo = MODEL_CATALOG[modelKey];
    const title = statusNote
        ? `${modelInfo.label} — ${statusNote}`
        : `Generating with ${modelInfo.label} (${modelInfo.cost})...`;

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title, cancellable: true },
        async (_progress, token) => {
            const controller = new AbortController();
            token.onCancellationRequested(() => controller.abort());
            try {
                const urls = await c.generate(
                    modelKey,
                    { prompt, aspect_ratio: aspectRatio, negative_prompt: negativePrompt || undefined },
                    controller.signal
                );
                const url = urls[0] ?? '';
                await addHistory(context, { prompt, urls, model: modelKey, aspectRatio, createdAt: new Date().toISOString() });
                outputChannel.appendLine(`✅ [${modelInfo.label}] ${aspectRatio} "${prompt.slice(0, 60)}..." → ${url}`);

                const markdownSnippet = `![${prompt}](${url})`;
                await vscode.env.clipboard.writeText(markdownSnippet);

                vscode.window.showInformationMessage(
                    `✅ ${modelInfo.label} image ready! Markdown copied.`,
                    'Open in Browser', 'Insert in Editor', 'Save to File'
                ).then(action => {
                    if (action === 'Open in Browser' && url) {
                        vscode.env.openExternal(vscode.Uri.parse(url));
                    } else if (action === 'Insert in Editor') {
                        insertMarkdownSnippet(markdownSnippet);
                    } else if (action === 'Save to File') {
                        saveLastToFile();
                    }
                });
            } catch (err) {
                if (token.isCancellationRequested) {
                    vscode.window.showInformationMessage('Replicate image generation cancelled.');
                    return;
                }
                const msg = err instanceof Error ? err.message : String(err);
                vscode.window.showErrorMessage(`Generation failed: ${msg}`);
                outputChannel.appendLine(`❌ Error [${modelInfo.label}]: ${msg}`);
            }
        }
    );
}

async function getNegativePrompt(): Promise<string> {
    return (await vscode.window.showInputBox({
        title: 'Negative Prompt (Optional)',
        prompt: 'Describe elements to avoid, or leave empty to skip.',
        ignoreFocusOut: true
    }))?.trim() ?? '';
}

async function addHistory(context: vscode.ExtensionContext, entry: HistoryEntry): Promise<void> {
    history = [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);
    await context.globalState.update(HISTORY_KEY, history);
}

function insertMarkdownSnippet(snippet: string): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('Open an editor to insert the image.');
        return;
    }
    editor.edit(eb => eb.insert(editor.selection.active, snippet));
}

async function saveLastToFile(): Promise<void> {
    if (history.length === 0) {
        vscode.window.showWarningMessage('No image generated yet.');
        return;
    }
    const last = history[0];
    const url = last.urls[0];
    if (!url) { return; }

    const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(
            path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '',
            `replicate-${Date.now()}.png`)
        ),
        filters: { 'Image': ['png', 'jpg', 'webp'] }
    });
    if (!saveUri) { return; }

    try {
        await vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: 'Downloading image...', cancellable: true },
            async (_progress, token) => {
                const controller = new AbortController();
                token.onCancellationRequested(() => controller.abort());
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) { throw new Error(`HTTP ${response.status}`); }
                const buffer = Buffer.from(await response.arrayBuffer());
                await fs.promises.writeFile(saveUri.fsPath, buffer);
                outputChannel.appendLine(`💾 Saved: ${saveUri.fsPath}`);
                vscode.window.showInformationMessage(`✅ Saved to ${path.basename(saveUri.fsPath)}`, 'Reveal').then(c => {
                    if (c) { vscode.commands.executeCommand('revealFileInOS', saveUri); }
                });
            }
        );
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            vscode.window.showInformationMessage('Replicate image download cancelled.');
            return;
        }
        const message = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Replicate image download failed: ${message}`);
    }
}

function viewHistory(): void {
    if (history.length === 0) {
        vscode.window.showInformationMessage('No generations yet.');
        return;
    }
    outputChannel.clear();
    outputChannel.appendLine('Replicate Image Studio — Generation History');
    outputChannel.appendLine('═'.repeat(60));
    history.forEach((h, i) => {
        const model = MODEL_CATALOG[h.model]?.label ?? h.model;
        const ratio = h.aspectRatio ? ` [${h.aspectRatio}]` : '';
        outputChannel.appendLine(
            `${i + 1}. [${model}]${ratio} "${h.prompt.slice(0, 50)}..."\n   → ${h.urls[0] ?? 'no url'}`
        );
    });
    outputChannel.show();
}

function insertLastImage(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || history.length === 0) {
        vscode.window.showWarningMessage('No image generated yet.');
        return;
    }
    const last = history[0];
    const url = last.urls[0] ?? '';
    editor.edit(eb => eb.insert(editor.selection.active, `![${last.prompt}](${url})`));
}

export function deactivate(): void {
    outputChannel?.appendLine('[Replicate Image Studio] Deactivated.');
}
