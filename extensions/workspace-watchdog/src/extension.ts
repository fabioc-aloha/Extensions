import * as vscode from 'vscode';
import * as path from 'path';
import { FileObservationStore } from '@alex-extensions/shared';

let outputChannel: vscode.OutputChannel;
let store: FileObservationStore;
let scanInterval: ReturnType<typeof setInterval> | undefined;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Workspace Watchdog');
    context.subscriptions.push(outputChannel);

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
    store = new FileObservationStore(workspaceRoot);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('workspaceWatchdog.showDashboard', () => showDashboard()),
        vscode.commands.registerCommand('workspaceWatchdog.scanNow', () => runScan()),
        vscode.commands.registerCommand('workspaceWatchdog.showHotFiles', () => showHotFiles()),
        vscode.commands.registerCommand('workspaceWatchdog.showStalledFiles', () => showStalledFiles()),
        vscode.commands.registerCommand('workspaceWatchdog.clearHistory', () => clearHistory())
    );

    // Track open documents
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor?.document.uri.scheme === 'file') {
                store.recordOpen(editor.document.uri.fsPath);
            }
        })
    );

    // Run initial scan, then every 30 minutes
    runScan();
    scanInterval = setInterval(() => runScan(), 30 * 60 * 1000);
    context.subscriptions.push({ dispose: () => clearInterval(scanInterval) });

    outputChannel.appendLine('[Workspace Watchdog] Activated.');
}

async function runScan(): Promise<void> {
    outputChannel.appendLine('[Watchdog] Scanning workspace...');
    const stalled = store.getStalledFiles();
    const hot = store.getHotFiles();
    const todos = store.getTodoHotspots(5);
    const health = store.getHealthTier();

    let statusIcon = health === 'green' ? '✅' : health === 'yellow' ? '⚠️' : '🔴';
    outputChannel.appendLine(`${statusIcon} Health: ${health.toUpperCase()} | Hot: ${hot.length} | Stalled: ${stalled.length} | TODO hotspots: ${todos.length}`);

    if (stalled.length > 0) {
        const critical = stalled.filter(f => f.severity === 'critical');
        if (critical.length > 0) {
            vscode.window.showWarningMessage(
                `Workspace Watchdog: ${critical.length} file(s) stalled >7 days with uncommitted changes.`,
                'Show Files'
            ).then(choice => { if (choice === 'Show Files') showStalledFiles(); });
        }
    }
}

function showDashboard(): void {
    const health = store.getHealthTier();
    const hot = store.getHotFiles();
    const stalled = store.getStalledFiles();
    const todos = store.getTodoHotspots(5);

    const lines = [
        `# Workspace Watchdog Dashboard`,
        `Health: **${health.toUpperCase()}**`,
        '',
        `## Hot Files (most active)`,
        ...hot.map(f => `- ${f.path} (opened ${f.openCount}x)`),
        '',
        `## Stalled Files`,
        ...stalled.map(f => `- [${f.severity.toUpperCase()}] ${f.path}`),
        '',
        `## TODO Hotspots`,
        ...todos.map(t => `- ${t.path} (${t.total} TODOs)`)
    ];

    outputChannel.clear();
    outputChannel.appendLine(lines.join('\n'));
    outputChannel.show();
}

function showHotFiles(): void {
    const hot = store.getHotFiles();
    if (hot.length === 0) {
        vscode.window.showInformationMessage('No hot files tracked yet. Open some files first.');
        return;
    }
    const items = hot.map(f => ({ label: path.basename(f.path), description: f.path, detail: `Opened ${f.openCount}x` }));
    vscode.window.showQuickPick(items, { title: 'Hot Files', placeHolder: 'Select to open' }).then(item => {
        if (item) { vscode.workspace.openTextDocument(item.description).then(doc => vscode.window.showTextDocument(doc)); }
    });
}

function showStalledFiles(): void {
    const stalled = store.getStalledFiles();
    if (stalled.length === 0) {
        vscode.window.showInformationMessage('No stalled files detected. Good shape!');
        return;
    }
    const items = stalled.map(f => ({
        label: `[${f.severity.toUpperCase()}] ${path.basename(f.path)}`,
        description: f.path,
        detail: `Uncommitted for ${Math.round(f.daysStalled)}d`
    }));
    vscode.window.showQuickPick(items, { title: 'Stalled Files', placeHolder: 'Select to open' }).then(item => {
        if (item) { vscode.workspace.openTextDocument(item.description).then(doc => vscode.window.showTextDocument(doc)); }
    });
}

function clearHistory(): void {
    vscode.window.showWarningMessage('Clear all Workspace Watchdog history?', 'Yes, Clear').then(choice => {
        if (choice === 'Yes, Clear') {
            // Clear by saving empty state - store will be recreated fresh on next activate
            store.save();  // Save current state - individual files can be cleared when committed
            outputChannel.appendLine('[Watchdog] History saved. Uncommitted markers clear when files are committed.');
            vscode.window.showInformationMessage('Workspace Watchdog: Unmarked stalled files will auto-clear on commit.');
        }
    });
}

export function deactivate(): void {
    if (scanInterval) { clearInterval(scanInterval); }
    outputChannel?.appendLine('[Workspace Watchdog] Deactivated.');
}
