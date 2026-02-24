import * as vscode from 'vscode';
import { ReplicateClient, SupportedModel } from '@alex-extensions/shared';

let outputChannel: vscode.OutputChannel;
let client: ReplicateClient;
const history: { prompt: string; urls: string[]; model: string; createdAt: string }[] = [];

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Replicate Image Studio');
    context.subscriptions.push(outputChannel);

    const loadClient = async () => {
        const key = await context.secrets.get('replicate.apiKey') ?? '';
        client = new ReplicateClient(key);
    };
    loadClient();

    context.subscriptions.push(
        vscode.commands.registerCommand('replicateStudio.generate', () => generateImage()),
        vscode.commands.registerCommand('replicateStudio.generateVideo', () => generateVideo()),
        vscode.commands.registerCommand('replicateStudio.setApiKey', async () => {
            const key = await vscode.window.showInputBox({ title: 'Replicate API Key', password: true, prompt: 'Get your key at replicate.com/account/api-tokens' });
            if (key) { await context.secrets.store('replicate.apiKey', key); client = new ReplicateClient(key); vscode.window.showInformationMessage('API key saved.'); }
        }),
        vscode.commands.registerCommand('replicateStudio.viewHistory', () => viewHistory()),
        vscode.commands.registerCommand('replicateStudio.insertMarkdown', () => insertLastImage())
    );

    outputChannel.appendLine('[Replicate Image Studio] Activated.');
}

async function generateImage(): Promise<void> {
    if (!client) { vscode.window.showErrorMessage('Set your Replicate API key first.'); return; }

    const model = await vscode.window.showQuickPick(
        [{ label: 'Flux Schnell (fast)', id: 'flux-schnell' }, { label: 'Flux Dev (quality)', id: 'flux-dev' }, { label: 'SDXL', id: 'sdxl' }],
        { title: 'Choose Model' }
    );
    if (!model) { return; }

    const prompt = await vscode.window.showInputBox({ title: 'Image Prompt', prompt: 'Describe the image you want to generate' });
    if (!prompt) { return; }

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Generating image with ${model.label}...`, cancellable: false },
        async () => {
            try {
                const urls = await client.generate(model.id as SupportedModel, { prompt });
                const url = urls[0] ?? '';
                history.unshift({ prompt, urls, model: model.id, createdAt: new Date().toISOString() });
                outputChannel.appendLine(`✅ Generated: ${url}`);
                await vscode.env.clipboard.writeText(`![${prompt}](${url})`);
                vscode.window.showInformationMessage('✅ Image generated! Markdown copied to clipboard.', 'Open in Browser').then(c => {
                    if (c && url) { vscode.env.openExternal(vscode.Uri.parse(url)); }
                });
            } catch (err) {
                vscode.window.showErrorMessage(`Generation failed: ${err}`);
                outputChannel.appendLine(`❌ Error: ${err}`);
            }
        }
    );
}

async function generateVideo(): Promise<void> {
    if (!client) { vscode.window.showErrorMessage('Set your Replicate API key first.'); return; }
    const prompt = await vscode.window.showInputBox({ title: 'Video Prompt (WAN 2.1)', prompt: 'Describe the video' });
    if (!prompt) { return; }
    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Generating video (this may take a few minutes)...', cancellable: false },
        async () => {
            try {
                const urls = await client.generate('wan-2-1', { prompt });
                const url = urls[0] ?? '';
                history.unshift({ prompt, urls, model: 'wan-2-1', createdAt: new Date().toISOString() });
                outputChannel.appendLine(`✅ Video generated: ${url}`);
                vscode.window.showInformationMessage('✅ Video generated!', 'Open in Browser').then(c => {
                    if (c && url) { vscode.env.openExternal(vscode.Uri.parse(url)); }
                });
            } catch (err) {
                vscode.window.showErrorMessage(`Video generation failed: ${err}`);
            }
        }
    );
}

function viewHistory(): void {
    if (history.length === 0) { vscode.window.showInformationMessage('No generations yet.'); return; }
    outputChannel.clear();
    outputChannel.appendLine('Replicate Generation History');
    outputChannel.appendLine('─'.repeat(50));
    history.forEach((h, i) => { outputChannel.appendLine(`${i + 1}. [${h.model}] "${h.prompt.slice(0, 50)}..." → ${h.urls[0] ?? 'no url'}`); });
    outputChannel.show();
}

function insertLastImage(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || history.length === 0) { vscode.window.showWarningMessage('No image generated yet.'); return; }
    const last = history[0];
    const url = last.urls[0] ?? '';
    editor.edit(eb => eb.insert(editor.selection.active, `![${last.prompt}](${url})`));
}

export function deactivate(): void {
    outputChannel?.appendLine('[Replicate Image Studio] Deactivated.');
}
