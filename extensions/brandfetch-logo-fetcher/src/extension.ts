import * as vscode from 'vscode';
import { BrandfetchClient, InsertFormat } from '@alex-extensions/shared';

let outputChannel: vscode.OutputChannel;
let client: BrandfetchClient;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Brandfetch Logo Fetcher');
    context.subscriptions.push(outputChannel);

    const loadClient = async () => {
        const [apiKey, logoDevApiKey] = await Promise.all([
            context.secrets.get('brandfetch.apiKey'),
            context.secrets.get('brandfetch.logoDevApiKey')
        ]);
        client = new BrandfetchClient(apiKey, logoDevApiKey);
    };
    loadClient();

    context.subscriptions.push(
        vscode.commands.registerCommand('brandfetch.fetchLogo', () => fetchLogo()),
        vscode.commands.registerCommand('brandfetch.insertLogo', () => insertLogo()),
        vscode.commands.registerCommand('brandfetch.clearCache', () => { client?.clearCache(); vscode.window.showInformationMessage('Logo cache cleared.'); }),
        vscode.commands.registerCommand('brandfetch.setApiKey', async () => {
            const provider = await vscode.window.showQuickPick([
                { label: 'Brandfetch', secretKey: 'brandfetch.apiKey', prompt: 'Get your key at brandfetch.com/developers' },
                { label: 'Logo.dev', secretKey: 'brandfetch.logoDevApiKey', prompt: 'Get your key at logo.dev' }
            ], { title: 'Choose Logo Provider API Key' });
            if (!provider) { return; }
            const key = await vscode.window.showInputBox({ title: `${provider.label} API Key`, password: true, prompt: provider.prompt });
            if (key) {
                await context.secrets.store(provider.secretKey, key.trim());
                await loadClient();
                vscode.window.showInformationMessage(`${provider.label} API key saved in VS Code SecretStorage.`);
            }
        })
    );

    outputChannel.appendLine('[Brandfetch Logo Fetcher] Activated.');
}

function getSelectedText(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return ''; }
    return editor.document.getText(editor.selection).trim();
}

async function fetchLogo(): Promise<void> {
    const domain = await vscode.window.showInputBox({ title: 'Fetch Logo', prompt: 'Enter domain (e.g. github.com)', value: getSelectedText() });
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
    const domain = await vscode.window.showInputBox({ title: 'Insert Logo', prompt: 'Enter domain (e.g. github.com)', value: getSelectedText() });
    if (!domain) { return; }
    const format = await vscode.window.showQuickPick(
        [{ label: 'Markdown Image', id: 'markdown' }, { label: 'SVG URL', id: 'svg-url' }, { label: 'PNG URL', id: 'png-url' }, { label: 'HTML <img>', id: 'html-img' }],
        { title: 'Insert Format' }
    );
    if (!format) { return; }
    try {
        const logo = await client.fetchLogo(domain);
        if (!logo) {
            vscode.window.showWarningMessage(`No logo found for ${domain}. Configure a Brandfetch or Logo.dev API key.`);
            return;
        }
        const formatted = BrandfetchClient.formatForInsert(logo, format.id as InsertFormat);
        editor.edit(eb => eb.insert(editor.selection.active, formatted));
    } catch (err) {
        vscode.window.showErrorMessage(`Failed: ${err}`);
    }
}

export function deactivate(): void {
    outputChannel?.appendLine('[Brandfetch Logo Fetcher] Deactivated.');
}
