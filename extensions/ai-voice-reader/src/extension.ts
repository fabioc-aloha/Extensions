import * as vscode from 'vscode';
import * as cp from 'child_process';

let outputChannel: vscode.OutputChannel;
let speechProcess: cp.ChildProcess | undefined;
let speechQueue: string[] = [];
const MAX_CHUNK_LENGTH = 900;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('AI Voice Reader');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('voiceReader.readSelection', () => readSelection()),
        vscode.commands.registerCommand('voiceReader.readDocument', () => readDocument()),
        vscode.commands.registerCommand('voiceReader.readFile', (uri?: vscode.Uri) => readFile(uri)),
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
    const voice = config.get<string>('voice')?.trim() ?? '';
    const clean = shouldStrip ? stripMarkdown(text) : text;

    if (!clean) { return; }

    speechQueue = splitIntoChunks(clean);
    outputChannel.appendLine(`[VoiceReader] Speaking ${clean.length} chars in ${speechQueue.length} chunk(s)...`);
    speakNext(rate, voice);
}

function speakNext(rate: number, voice: string): void {
    const chunk = speechQueue.shift();
    if (!chunk) {
        outputChannel.appendLine('[VoiceReader] Playback complete.');
        return;
    }

    // Windows: PowerShell Add-Type / SpeechSynthesizer
    if (process.platform === 'win32') {
        const ps = 'Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; if ($env:VOICE_READER_VOICE) { $s.SelectVoice($env:VOICE_READER_VOICE) }; $s.Rate = [int]$env:VOICE_READER_RATE; $s.Speak($env:VOICE_READER_TEXT)';
        speechProcess = cp.spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], {
            env: {
                ...process.env,
                VOICE_READER_TEXT: chunk,
                VOICE_READER_VOICE: voice,
                VOICE_READER_RATE: String(Math.round((rate - 1) * 10))
            }
        });
    } else if (process.platform === 'darwin') {
        const args = voice ? ['-v', voice, '-r', String(Math.round(rate * 200)), chunk] : ['-r', String(Math.round(rate * 200)), chunk];
        speechProcess = cp.spawn('say', args);
    } else {
        // Linux: espeak
        const args = voice ? ['-v', voice, '-s', String(Math.round(rate * 150)), chunk] : ['-s', String(Math.round(rate * 150)), chunk];
        speechProcess = cp.spawn('espeak', args);
    }
    speechProcess.on('error', err => {
        outputChannel.appendLine(`[VoiceReader] Error: ${err.message}`);
        speechQueue = [];
    });
    speechProcess.on('close', () => {
        speechProcess = undefined;
        speakNext(rate, voice);
    });
}

function readSelection(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const text = editor.document.getText(editor.selection) || editor.document.getText();
    speak(text);
}

function readDocument(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    speak(editor.document.getText());
}

async function readFile(uri?: vscode.Uri): Promise<void> {
    let target = uri;
    if (!target) {
        const picked = await vscode.window.showOpenDialog({ filters: { 'Text Files': ['md', 'txt', 'ts', 'js', 'py'] } });
        if (!picked?.[0]) { return; }
        target = picked[0];
    }
    const doc = await vscode.workspace.openTextDocument(target);
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
    try {
        const voices = await getSystemVoices();
        const configuredVoice = vscode.workspace.getConfiguration('voiceReader').get<string>('voice') ?? '';
        const choice = await vscode.window.showQuickPick(
            [
                { label: 'System default', value: '', description: 'Use the operating system default voice' },
                ...voices.map(voice => ({ label: voice, value: voice }))
            ],
            {
                title: 'CX AI Voice Reader - Select System Voice',
                placeHolder: configuredVoice || 'System default'
            }
        );
        if (!choice) { return; }
        await vscode.workspace.getConfiguration('voiceReader').update('voice', choice.value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Voice Reader: ${choice.label} selected.`);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Voice Reader: Could not list system voices. ${message}`);
    }
}

function splitIntoChunks(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) ?? [text];
    const chunks: string[] = [];
    let chunk = '';

    for (const sentence of sentences) {
        for (const normalized of splitOversizedText(sentence.trim())) {
            if ((chunk.length + normalized.length + 1) <= MAX_CHUNK_LENGTH) {
                chunk = chunk ? `${chunk} ${normalized}` : normalized;
                continue;
            }
            if (chunk) { chunks.push(chunk); }
            chunk = normalized;
        }
    }
    if (chunk) { chunks.push(chunk); }
    return chunks;
}

function splitOversizedText(text: string): string[] {
    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > MAX_CHUNK_LENGTH) {
        const wordBoundary = remaining.lastIndexOf(' ', MAX_CHUNK_LENGTH);
        const splitIndex = wordBoundary > 0 ? wordBoundary : MAX_CHUNK_LENGTH;
        chunks.push(remaining.slice(0, splitIndex).trim());
        remaining = remaining.slice(splitIndex).trim();
    }
    if (remaining) { chunks.push(remaining); }
    return chunks;
}

function getSystemVoices(): Promise<string[]> {
    if (process.platform === 'win32') {
        return runVoiceCommand(
            'powershell',
            ['-NoProfile', '-Command', 'Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }'],
            output => output.split(/\r?\n/).map(voice => voice.trim()).filter(Boolean)
        );
    }
    if (process.platform === 'darwin') {
        return runVoiceCommand(
            'say',
            ['-v', '?'],
            output => output.split(/\r?\n/).map(line => line.trim().split(/\s+/)[0]).filter(Boolean)
        );
    }
    return runVoiceCommand(
        'espeak',
        ['--voices'],
        output => output.split(/\r?\n/).slice(1).map(line => line.trim().split(/\s+/)[3]).filter(Boolean)
    );
}

function runVoiceCommand(
    command: string,
    args: string[],
    parse: (output: string) => string[]
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        cp.execFile(command, args, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve([...new Set(parse(stdout))]);
        });
    });
}

export function deactivate(): void {
    stop();
    outputChannel?.appendLine('[AI Voice Reader] Deactivated.');
}
