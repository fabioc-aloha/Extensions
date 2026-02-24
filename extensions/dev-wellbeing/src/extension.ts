import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;
let postureTimer: NodeJS.Timer | undefined;
let eyeTimer: NodeJS.Timer | undefined;
let hydrationTimer: NodeJS.Timer | undefined;
let sessionStart: number | undefined;
let keystrokeCount = 0;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Dev Wellbeing');
    context.subscriptions.push(outputChannel);

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

    postureTimer = setInterval(() => {
        vscode.window.showInformationMessage('🪑 Posture check! Sit up straight, unclench your shoulders.', 'Thanks!');
        outputChannel.appendLine('[Wellbeing] Posture reminder sent.');
    }, cfg.posture);

    eyeTimer = setInterval(() => {
        vscode.window.showInformationMessage('👁️ 20-20-20 rule: Look at something 20 feet away for 20 seconds.', 'Done');
        outputChannel.appendLine('[Wellbeing] Eye break reminder sent.');
    }, cfg.eye);

    hydrationTimer = setInterval(() => {
        vscode.window.showInformationMessage('💧 Hydration check! Have you had water recently?', 'Yes');
        outputChannel.appendLine('[Wellbeing] Hydration reminder sent.');
    }, cfg.hydration);

    vscode.window.showInformationMessage('✅ Dev Wellbeing monitoring started.');
    outputChannel.appendLine('[Wellbeing] Monitoring started.');
}

function stopMonitoring(): void {
    if (postureTimer) { clearInterval(postureTimer); postureTimer = undefined; }
    if (eyeTimer) { clearInterval(eyeTimer); eyeTimer = undefined; }
    if (hydrationTimer) { clearInterval(hydrationTimer); hydrationTimer = undefined; }
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
    outputChannel?.appendLine('[Dev Wellbeing] Deactivated.');
}
