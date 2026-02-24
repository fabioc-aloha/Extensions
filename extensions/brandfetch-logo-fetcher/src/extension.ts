import * as vscode from 'vscode';
import { BrandfetchClient, InsertFormat } from '@alex-extensions/shared';

let outputChannel: vscode.OutputChannel;
let client: BrandfetchClient;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Brandfetch Logo Fetcher');
    context.subscriptions.push(outputChannel);

    const loadClient = async () => {
        const apiKey = await context.secrets.get('brandfetch.apiKey') ?? '';
        client = new BrandfetchClient(apiKey);
    };
    loadClient();

    context.subscriptions.push(
        vscode.commands.registerCommand('brandfetch.fetchLogo', () => fetchLogo()),
        vscode.commands.registerCommand('brandfetch.insertLogo', () => insertLogo()),
        vscode.commands.registerCommand('brandfetch.clearCache', () => { client?.clearCache(); vscode.window.showInformationMessage('Logo cache cleared.'); }),
        vscode.commands.registerCommand('brandfetch.setApiKey', async () => {
            const key = await vscode.window.showInputBox({ title: 'Brandfetch API Key', password: true, prompt: 'Get your key at brandfetch.com/profile/api' });
            if (key) { await context.secrets.store('brandfetch.apiKey', key); client = new BrandfetchClient(key); vscode.window.showInformationMessage('API key saved.'); }
        })
    );

    outputChannel.appendLine('[Brandfetch Logo Fetcher] Activated.');
}

async function fetchLogo(): Promise<void> {
    const domain = await vscode.window.showInputBox({ title: 'Fetch Logo', prompt: 'Enter domain (e.g. github.com)' });
    if (!domain) { return; }

    const format = await vscode.window.showQuickPick(
        [{ label: 'Markdown Image', id: 'markdown' }, { label: 'SVG URL', id: 'svg-url' }, { label: 'PNG URL', id: 'png-url' }, { label: 'HTML <img>', id: 'html-img' }],
        { title: 'Output Format' }
    );
    if (!format) { return; }

    try {
        const logo = await client.fetchLogo(domain);
        if (!logo) { vscode.window.showWarningMessage(`No logo found for ${domain}`); return; }
        const formatted = BrandfetchClient.formatForInsert(logo, format.id as InsertFormat);
        await vscode.env.clipboard.writeText(formatted);
        vscode.window.showInformationMessage(`✅ Logo for ${domain} copied to clipboard.`);
        outputChannel.appendLine(`[Brandfetch] ${domain} → ${formatted}`);
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to fetch logo: ${err}`);
    }
}

async function insertLogo(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { vscode.window.showWarningMessage('No active editor.'); return; }
    const domain = await vscode.window.showInputBox({ title: 'Insert Logo', prompt: 'Enter domain (e.g. github.com)' });
    if (!domain) { return; }
    try {
        const logo = await client.fetchLogo(domain);
        if (!logo) { vscode.window.showWarningMessage(`No logo found for ${domain}`); return; }
        const formatted = BrandfetchClient.formatForInsert(logo, 'markdown');
        editor.edit(eb => eb.insert(editor.selection.active, formatted));
    } catch (err) {
        vscode.window.showErrorMessage(`Failed: ${err}`);
    }
}

export function deactivate(): void {
    outputChannel?.appendLine('[Brandfetch Logo Fetcher] Deactivated.');
}
