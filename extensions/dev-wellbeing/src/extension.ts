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
let editEventCount = 0;
let extensionContext: vscode.ExtensionContext;
let persistTimer: ReturnType<typeof setTimeout> | undefined;
const SESSION_KEY = 'devWellbeing.session';

export function activate(context: vscode.ExtensionContext): void {
    extensionContext = context;
    outputChannel = vscode.window.createOutputChannel('Dev Wellbeing');
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 95);
    context.subscriptions.push(
        outputChannel,
        statusBar,
        vscode.commands.registerCommand('devWellbeing.start', startMonitoring),
        vscode.commands.registerCommand('devWellbeing.stop', stopMonitoring),
        vscode.commands.registerCommand('devWellbeing.showStats', showStats),
        vscode.commands.registerCommand('devWellbeing.resetSession', resetSession),
        vscode.commands.registerCommand('devWellbeing.configureLimits', () => {
            void vscode.commands.executeCommand('workbench.action.openSettings', 'devWellbeing');
        }),
        vscode.workspace.onDidChangeTextDocument(() => {
            if (isMonitoring()) {
                editEventCount += 1;
                schedulePersist();
            }
        }),
        vscode.workspace.onDidChangeConfiguration(event => {
            if (isMonitoring() && event.affectsConfiguration('devWellbeing')) {
                outputChannel.appendLine('[Wellbeing] Settings changed; restarting reminder intervals.');
                restartMonitoring();
            }
        })
    );
    const saved = context.globalState.get<{ sessionStart?: number; editEventCount?: number }>(SESSION_KEY);
    sessionStart = saved?.sessionStart;
    editEventCount = saved?.editEventCount ?? 0;

    if (vscode.workspace.getConfiguration('devWellbeing').get<boolean>('enabled') !== false) {
        startMonitoring();
    } else {
        updateStatusBar();
    }
    outputChannel.appendLine('[Dev Wellbeing] Activated. This extension only tracks local session duration and document edit events while monitoring.');
}

function getConfig(): { posture: number; eye: number; hydration: number } {
    const config = vscode.workspace.getConfiguration('devWellbeing');
    return {
        posture: Math.max(1, config.get<number>('postureReminderMinutes') ?? 45) * 60_000,
        eye: Math.max(1, config.get<number>('eyeBreakMinutes') ?? 20) * 60_000,
        hydration: Math.max(1, config.get<number>('hydrationMinutes') ?? 60) * 60_000
    };
}

function isMonitoring(): boolean {
    return postureTimer !== undefined;
}

function startMonitoring(): void {
    if (isMonitoring()) {
        vscode.window.showInformationMessage('Dev Wellbeing monitoring is already active.');
        return;
    }
    sessionStart ??= Date.now();
    void persistSession();
    scheduleReminders();
    vscode.window.showInformationMessage('Dev Wellbeing monitoring started. Reminders are local to this VS Code session.');
    outputChannel.appendLine('[Wellbeing] Monitoring started.');
}

function restartMonitoring(): void {
    clearTimers();
    sessionStart = sessionStart ?? Date.now();
    scheduleReminders();
}

function scheduleReminders(): void {
    const config = getConfig();
    nextPosture = Date.now() + config.posture;
    nextEye = Date.now() + config.eye;
    nextHydration = Date.now() + config.hydration;

    postureTimer = setInterval(() => {
        vscode.window.showInformationMessage('Posture reminder: pause briefly to adjust your setup.', 'Dismiss');
        outputChannel.appendLine('[Wellbeing] Posture reminder sent.');
        nextPosture = Date.now() + config.posture;
        updateStatusBar();
    }, config.posture);
    eyeTimer = setInterval(() => {
        vscode.window.showInformationMessage('Screen break reminder: look away from the editor for a short pause.', 'Dismiss');
        outputChannel.appendLine('[Wellbeing] Screen break reminder sent.');
        nextEye = Date.now() + config.eye;
        updateStatusBar();
    }, config.eye);
    hydrationTimer = setInterval(() => {
        vscode.window.showInformationMessage('Hydration reminder: take a moment to check in with yourself.', 'Dismiss');
        outputChannel.appendLine('[Wellbeing] Hydration reminder sent.');
        nextHydration = Date.now() + config.hydration;
        updateStatusBar();
    }, config.hydration);
    statusBarRefresh = setInterval(updateStatusBar, 30_000);
    updateStatusBar();
}

function clearTimers(): void {
    if (postureTimer) { clearInterval(postureTimer); postureTimer = undefined; }
    if (eyeTimer) { clearInterval(eyeTimer); eyeTimer = undefined; }
    if (hydrationTimer) { clearInterval(hydrationTimer); hydrationTimer = undefined; }
    if (statusBarRefresh) { clearInterval(statusBarRefresh); statusBarRefresh = undefined; }
    nextPosture = undefined;
    nextEye = undefined;
    nextHydration = undefined;
}

function stopMonitoring(): void {
    if (!isMonitoring()) {
        return;
    }
    clearTimers();
    void persistSession();
    updateStatusBar();
    outputChannel.appendLine('[Wellbeing] Monitoring stopped.');
    vscode.window.showInformationMessage('Dev Wellbeing monitoring stopped. Local session details remain available until reset.');
}

function schedulePersist(): void {
    if (persistTimer) { clearTimeout(persistTimer); }
    persistTimer = setTimeout(() => { void persistSession(); }, 1000);
}

async function persistSession(): Promise<void> {
    await extensionContext.globalState.update(SESSION_KEY, { sessionStart, editEventCount });
}

async function resetSession(): Promise<void> {
    const choice = await vscode.window.showWarningMessage(
        'Reset the locally stored Dev Wellbeing session start and edit-event count?',
        { modal: true },
        'Reset Session'
    );
    if (choice !== 'Reset Session') { return; }
    sessionStart = isMonitoring() ? Date.now() : undefined;
    editEventCount = 0;
    await persistSession();
    vscode.window.showInformationMessage('Dev Wellbeing: local session details reset.');
}

function updateStatusBar(): void {
    if (!isMonitoring() || !nextEye || !nextPosture || !nextHydration) {
        statusBar.text = '$(heart) Wellbeing';
        statusBar.tooltip = 'Dev Wellbeing — local reminder monitoring is stopped. Click to start.';
        statusBar.command = 'devWellbeing.start';
        statusBar.show();
        return;
    }
    const now = Date.now();
    const eyeMinutes = Math.max(0, Math.ceil((nextEye - now) / 60_000));
    const postureMinutes = Math.max(0, Math.ceil((nextPosture - now) / 60_000));
    const hydrationMinutes = Math.max(0, Math.ceil((nextHydration - now) / 60_000));
    const nextReminder = Math.min(eyeMinutes, postureMinutes, hydrationMinutes);
    statusBar.text = `$(heart) ${nextReminder}m`;
    statusBar.tooltip = [
        'Dev Wellbeing — click for local session details',
        `Screen break in ${eyeMinutes}m`,
        `Posture reminder in ${postureMinutes}m`,
        `Hydration reminder in ${hydrationMinutes}m`
    ].join('\n');
    statusBar.command = 'devWellbeing.showStats';
    statusBar.show();
}

function showStats(): void {
    if (!sessionStart) {
        vscode.window.showInformationMessage('Start monitoring to see local session details.');
        return;
    }
    const elapsedMinutes = Math.floor((Date.now() - sessionStart) / 60_000);
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;
    outputChannel.clear();
    outputChannel.appendLine('Dev Wellbeing — Local Session Details');
    outputChannel.appendLine('─'.repeat(52));
    outputChannel.appendLine(`Monitoring: ${isMonitoring() ? 'active' : 'stopped'}`);
    outputChannel.appendLine(`Session duration: ${hours}h ${minutes}m`);
    outputChannel.appendLine(`Document edit events while monitoring: ${editEventCount}`);
    outputChannel.appendLine('This extension does not infer health, diagnose conditions, or retain session activity after VS Code closes.');
    outputChannel.show();
}

export async function deactivate(): Promise<void> {
    clearTimers();
    if (persistTimer) { clearTimeout(persistTimer); }
    await persistSession();
}
