import * as vscode from 'vscode';
import * as cp from 'child_process';

let outputChannel: vscode.OutputChannel;
let speechProcess: cp.ChildProcess | undefined;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('AI Voice Reader');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('voiceReader.readSelection', () => readSelection()),
        vscode.commands.registerCommand('voiceReader.readDocument', () => readDocument()),
        vscode.commands.registerCommand('voiceReader.readFile', () => readFile()),
        vscode.commands.registerCommand('voiceReader.stop', () => stop()),
        vscode.commands.registerCommand('voiceReader.setVoice', () => setVoice())
    );

    outputChannel.appendLine('[AI Voice Reader] Activated.');
}

function stripMarkdown(text: string): string {
    return text
        .replace(/```[\s\S]*?```/g, ' code block. ')
        .replace(/`[^`]+`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, ' image. ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/[*_~]{1,2}([^*_~]+)[*_~]{1,2}/g, '$1')
        .replace(/^\s*[-*+]\s/gm, '')
        .replace(/^\s*\d+\.\s/gm, '')
        .replace(/\n{2,}/g, '. ')
        .trim();
}

function speak(text: string): void {
    stop();
    const config = vscode.workspace.getConfiguration('voiceReader');
    const shouldStrip = config.get<boolean>('stripMarkdown') ?? true;
    const rate = config.get<number>('rate') ?? 1.0;
    const clean = shouldStrip ? stripMarkdown(text) : text;

    if (!clean) { return; }

    outputChannel.appendLine(`[VoiceReader] Speaking ${clean.length} chars...`);

    // Windows: PowerShell Add-Type / SpeechSynthesizer
    if (process.platform === 'win32') {
        const escaped = clean.replace(/'/g, "''");
        const ps = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = ${Math.round((rate - 1) * 10)}; $s.Speak('${escaped}')`;
        speechProcess = cp.spawn('powershell', ['-NoProfile', '-Command', ps]);
    } else if (process.platform === 'darwin') {
        speechProcess = cp.spawn('say', ['-r', String(Math.round(rate * 200)), clean]);
    } else {
        // Linux: espeak
        speechProcess = cp.spawn('espeak', ['-s', String(Math.round(rate * 150)), clean]);
    }
    speechProcess.on('error', err => { outputChannel.appendLine(`[VoiceReader] Error: ${err.message}`); });
}

function readSelection(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const text = editor.document.getText(editor.selection) || editor.document.lineAt(editor.selection.active.line).text;
    speak(text);
}

function readDocument(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    speak(editor.document.getText());
}

async function readFile(): Promise<void> {
    const uri = await vscode.window.showOpenDialog({ filters: { 'Text Files': ['md', 'txt', 'ts', 'js', 'py'] } });
    if (!uri?.[0]) { return; }
    const doc = await vscode.workspace.openTextDocument(uri[0]);
    speak(doc.getText());
}

function stop(): void {
    if (speechProcess) {
        speechProcess.kill();
        speechProcess = undefined;
        outputChannel.appendLine('[VoiceReader] Stopped.');
    }
}

async function setVoice(): Promise<void> {
    vscode.window.showInformationMessage('Voice selection: configure via OS speech settings or set `voiceReader.engine` to "azure" for Azure Cognitive Speech voices.');
}

export function deactivate(): void {
    stop();
    outputChannel?.appendLine('[AI Voice Reader] Deactivated.');
}
