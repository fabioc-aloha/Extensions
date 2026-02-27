import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;
let postureTimer: ReturnType<typeof setInterval> | undefined;
let eyeTimer: ReturnType<typeof setInterval> | undefined;
let hydrationTimer: ReturnType<typeof setInterval> | undefined;
let statusBarRefresh: ReturnType<typeof setInterval> | undefined;
let sessionStart: number | undefined;
let nextPosture: number | undefined;
let nextEye: number | undefined;
let nextHydration: number | undefined;
let keystrokeCount = 0;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Dev Wellbeing');
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 95);
    statusBar.command = 'devWellbeing.showStats';
    context.subscriptions.push(outputChannel, statusBar);

    context.subscriptions.push(
        vscode.commands.registerCommand('devWellbeing.start', () => startMonitoring()),
        vscode.commands.registerCommand('devWellbeing.stop', () => stopMonitoring()),
        vscode.commands.registerCommand('devWellbeing.showStats', () => showStats()),
        vscode.commands.registerCommand('devWellbeing.configureLimits', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'devWellbeing');
        })
    );

    // Auto-start if enabled
    const config = vscode.workspace.getConfiguration('devWellbeing');
    if (config.get<boolean>('enabled') !== false) { startMonitoring(); }

    // Track keystrokes
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => { keystrokeCount++; })
    );

    outputChannel.appendLine('[Dev Wellbeing] Activated. Take care of yourself!');
}

function getConfig() {
    const c = vscode.workspace.getConfiguration('devWellbeing');
    return {
        posture: (c.get<number>('postureReminderMinutes') ?? 45) * 60 * 1000,
        eye: (c.get<number>('eyeBreakMinutes') ?? 20) * 60 * 1000,
        hydration: (c.get<number>('hydrationMinutes') ?? 60) * 60 * 1000
    };
}

function startMonitoring(): void {
    stopMonitoring();
    sessionStart = Date.now();
    keystrokeCount = 0;
    const cfg = getConfig();

    nextPosture = Date.now() + cfg.posture;
    nextEye = Date.now() + cfg.eye;
    nextHydration = Date.now() + cfg.hydration;

    postureTimer = setInterval(() => {
        vscode.window.showInformationMessage('🪑 Posture check! Sit up straight, unclench your shoulders.', 'Thanks!');
        outputChannel.appendLine('[Wellbeing] Posture reminder sent.');
        nextPosture = Date.now() + cfg.posture;
        updateStatusBar();
    }, cfg.posture);

    eyeTimer = setInterval(() => {
        vscode.window.showInformationMessage('👁️ 20-20-20 rule: Look at something 20 feet away for 20 seconds.', 'Done');
        outputChannel.appendLine('[Wellbeing] Eye break reminder sent.');
        nextEye = Date.now() + cfg.eye;
        updateStatusBar();
    }, cfg.eye);

    hydrationTimer = setInterval(() => {
        vscode.window.showInformationMessage('💧 Hydration check! Have you had water recently?', 'Yes');
        outputChannel.appendLine('[Wellbeing] Hydration reminder sent.');
        nextHydration = Date.now() + cfg.hydration;
        updateStatusBar();
    }, cfg.hydration);

    // Refresh status bar every 30s so countdown stays current
    statusBarRefresh = setInterval(() => updateStatusBar(), 30_000);
    updateStatusBar();

    vscode.window.showInformationMessage('✅ Dev Wellbeing monitoring started.');
    outputChannel.appendLine('[Wellbeing] Monitoring started.');
}

function stopMonitoring(): void {
    if (postureTimer) { clearInterval(postureTimer); postureTimer = undefined; }
    if (eyeTimer) { clearInterval(eyeTimer); eyeTimer = undefined; }
    if (hydrationTimer) { clearInterval(hydrationTimer); hydrationTimer = undefined; }
    if (statusBarRefresh) { clearInterval(statusBarRefresh); statusBarRefresh = undefined; }
    nextPosture = undefined; nextEye = undefined; nextHydration = undefined;
    updateStatusBar();
}

function updateStatusBar(): void {
    if (!sessionStart || !nextEye) {
        statusBar.text = '$(heart) Wellbeing';
        statusBar.tooltip = 'Dev Wellbeing — click to start monitoring';
        statusBar.show();
        return;
    }
    const now = Date.now();
    const eyeMins = Math.max(0, Math.round((nextEye - now) / 60_000));
    const postureMins = nextPosture ? Math.max(0, Math.round((nextPosture - now) / 60_000)) : 0;
    const hydMins = nextHydration ? Math.max(0, Math.round((nextHydration - now) / 60_000)) : 0;
    const next = Math.min(eyeMins, postureMins, hydMins);
    statusBar.text = `$(heart) ${next}m`;
    statusBar.tooltip = [
        'Dev Wellbeing — click for session stats',
        `👁️ Eye break in ${eyeMins}m`,
        `🪑 Posture in ${postureMins}m`,
        `💧 Hydration in ${hydMins}m`
    ].join('\n');
    statusBar.show();
}

function showStats(): void {
    if (!sessionStart) { vscode.window.showInformationMessage('Start monitoring first.'); return; }
    const elapsed = Math.round((Date.now() - sessionStart) / 60000);
    const hours = Math.floor(elapsed / 60);
    const mins = elapsed % 60;
    outputChannel.clear();
    outputChannel.appendLine('Dev Wellbeing — Session Stats');
    outputChannel.appendLine('─'.repeat(40));
    outputChannel.appendLine(`Session duration: ${hours}h ${mins}m`);
    outputChannel.appendLine(`Keystrokes: ~${keystrokeCount}`);
    outputChannel.appendLine(`Tip: ${elapsed > 120 ? 'Consider a longer break after 2h of coding.' : 'Pace looks good!'}`);
    outputChannel.show();
}

export function deactivate(): void {
    stopMonitoring();
    statusBar?.dispose();
    outputChannel?.appendLine('[Dev Wellbeing] Deactivated.');
}
