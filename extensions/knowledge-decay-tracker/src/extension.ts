import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { DecayEngine, DecayProfile } from '../../shared/utils/decay';

let outputChannel: vscode.OutputChannel;
const engine = new DecayEngine();

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Knowledge Decay Tracker');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('knowledgeDecay.scanWorkspace', () => scanWorkspace()),
        vscode.commands.registerCommand('knowledgeDecay.showReport', () => showReport()),
        vscode.commands.registerCommand('knowledgeDecay.touchFile', () => touchCurrentFile()),
        vscode.commands.registerCommand('knowledgeDecay.showCritical', () => showCritical())
    );

    outputChannel.appendLine('[Knowledge Decay Tracker] Activated.');
}

async function scanWorkspace(): Promise<void> {
    const config = vscode.workspace.getConfiguration('knowledgeDecay');
    const profile = (config.get<string>('profile') ?? 'moderate') as DecayProfile;
    const patterns = config.get<string[]>('filePatterns') ?? ['**/*.md'];

    const allFiles: { path: string; score: number; tier: string; lastModified: number }[] = [];

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Knowledge Decay: Scanning...', cancellable: false },
        async () => {
            for (const pattern of patterns) {
                const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
                for (const file of files) {
                    try {
                        const stat = fs.statSync(file.fsPath);
                        const tag = { lastTouched: stat.mtimeMs, referenceCount: 1 };
                        const score = engine.score(tag, profile);
                        const tier = engine.tier(score);
                        allFiles.push({ path: file.fsPath, score, tier, lastModified: stat.mtimeMs });
                    } catch { /* skip */ }
                }
            }
        }
    );

    const critical = allFiles.filter(f => f.tier === 'critical');
    const stale = allFiles.filter(f => f.tier === 'stale');
    outputChannel.clear();
    outputChannel.appendLine(`Knowledge Decay Report — ${new Date().toLocaleString()}`);
    outputChannel.appendLine(`Profile: ${profile} | Files scanned: ${allFiles.length}`);
    outputChannel.appendLine('─'.repeat(50));
    outputChannel.appendLine(`🔴 CRITICAL (${critical.length}):`);
    critical.forEach(f => outputChannel.appendLine(`  ${path.basename(f.path)} — ${Math.round((Date.now() - f.lastModified) / 86400000)}d ago`));
    outputChannel.appendLine(`⚠️ STALE (${stale.length}):`);
    stale.forEach(f => outputChannel.appendLine(`  ${path.basename(f.path)} — ${Math.round((Date.now() - f.lastModified) / 86400000)}d ago`));
    outputChannel.show();

    const msg = critical.length > 0
        ? `🔴 Knowledge Decay: ${critical.length} critical file(s) need attention.`
        : stale.length > 0 ? `⚠️ Knowledge Decay: ${stale.length} stale file(s).`
        : '✅ Knowledge Decay: All files are fresh.';
    vscode.window.showInformationMessage(msg, 'View Report').then(c => { if (c) outputChannel.show(); });
}

function showReport(): void {
    outputChannel.show();
}

async function showCritical(): Promise<void> {
    const config = vscode.workspace.getConfiguration('knowledgeDecay');
    const profile = (config.get<string>('profile') ?? 'moderate') as DecayProfile;
    const patterns = config.get<string[]>('filePatterns') ?? ['**/*.md'];
    const critical: { label: string; description: string }[] = [];

    for (const pattern of patterns) {
        const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
        for (const file of files) {
            try {
                const stat = fs.statSync(file.fsPath);
                const score = engine.score({ lastTouched: stat.mtimeMs, referenceCount: 1 }, profile);
                if (engine.tier(score) === 'critical') {
                    critical.push({ label: path.basename(file.fsPath), description: file.fsPath });
                }
            } catch { /* skip */ }
        }
    }

    if (critical.length === 0) { vscode.window.showInformationMessage('No critical files. All good!'); return; }
    vscode.window.showQuickPick(critical, { title: 'Critical Decayed Files', placeHolder: 'Select to open' }).then(item => {
        if (item) { vscode.workspace.openTextDocument(item.description).then(doc => vscode.window.showTextDocument(doc)); }
    });
}

async function touchCurrentFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const now = Date.now();
    fs.utimesSync(editor.document.uri.fsPath, new Date(now), new Date(now));
    vscode.window.showInformationMessage(`✅ Marked "${path.basename(editor.document.uri.fsPath)}" as fresh.`);
}

export function deactivate(): void {
    outputChannel?.appendLine('[Knowledge Decay Tracker] Deactivated.');
}
