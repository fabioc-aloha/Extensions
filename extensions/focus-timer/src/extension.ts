import * as vscode from 'vscode';

interface SessionRecord {
    type: 'focus' | 'break';
    completedAt: string;
    durationMinutes: number;
    note?: string;
}

interface PersistedFocusState {
    sessionsCompleted: number;
    sessionHistory: SessionRecord[];
}

const HISTORY_KEY = 'focusTimer.history';
const MAX_HISTORY_ENTRIES = 200;

let extensionContext: vscode.ExtensionContext;
let outputChannel: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;
let timer: ReturnType<typeof setInterval> | undefined;
let secondsLeft = 0;
let isRunning = false;
let isPaused = false;
let isBreak = false;
let sessionsCompleted = 0;
let currentSessionDurationMinutes = 0;
let sessionHistory: SessionRecord[] = [];

export function activate(context: vscode.ExtensionContext): void {
    extensionContext = context;
    outputChannel = vscode.window.createOutputChannel('Focus Timer');
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.command = 'focusTimer.start';
    statusBar.show();
    loadState();
    updateStatusBar();
    context.subscriptions.push(
        outputChannel,
        statusBar,
        vscode.commands.registerCommand('focusTimer.start', startFocus),
        vscode.commands.registerCommand('focusTimer.stop', stop),
        vscode.commands.registerCommand('focusTimer.pause', togglePause),
        vscode.commands.registerCommand('focusTimer.startBreak', startBreak),
        vscode.commands.registerCommand('focusTimer.showHistory', showHistory),
        vscode.commands.registerCommand('focusTimer.addNote', addNote),
        vscode.commands.registerCommand('focusTimer.resetSessions', resetSessions)
    );

    void vscode.commands.executeCommand('setContext', 'focusTimer.running', false);
    outputChannel.appendLine(`[Focus Timer] Activated. Loaded ${sessionHistory.length} locally stored session(s).`);
}

function loadState(): void {
    const saved = extensionContext.globalState.get<PersistedFocusState>(HISTORY_KEY);
    if (!saved) {
        return;
    }
    sessionsCompleted = Number.isSafeInteger(saved.sessionsCompleted) && saved.sessionsCompleted >= 0
        ? saved.sessionsCompleted
        : 0;
    sessionHistory = Array.isArray(saved.sessionHistory)
        ? saved.sessionHistory.filter(isSessionRecord).slice(-MAX_HISTORY_ENTRIES)
        : [];
}

function isSessionRecord(value: unknown): value is SessionRecord {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const record = value as Partial<SessionRecord>;
    return (record.type === 'focus' || record.type === 'break')
        && typeof record.completedAt === 'string'
        && typeof record.durationMinutes === 'number'
        && (record.note === undefined || typeof record.note === 'string');
}

async function persistState(): Promise<void> {
    sessionHistory = sessionHistory.slice(-MAX_HISTORY_ENTRIES);
    await extensionContext.globalState.update(HISTORY_KEY, { sessionsCompleted, sessionHistory });
}

function getConfig(): { work: number; short: number; long: number } {
    const config = vscode.workspace.getConfiguration('focusTimer');
    return {
        work: (config.get<number>('workMinutes') ?? 25) * 60,
        short: (config.get<number>('shortBreakMinutes') ?? 5) * 60,
        long: (config.get<number>('longBreakMinutes') ?? 15) * 60
    };
}

function startFocus(): void {
    if (isRunning) {
        stop();
    }
    const config = getConfig();
    secondsLeft = config.work;
    currentSessionDurationMinutes = config.work / 60;
    isBreak = false;
    isRunning = true;
    isPaused = false;
    void vscode.commands.executeCommand('setContext', 'focusTimer.running', true);
    outputChannel.appendLine(`[Focus Timer] Starting ${currentSessionDurationMinutes}m focus session.`);
    startTicking();
}

function startBreak(): void {
    if (isRunning) {
        stop();
    }
    const config = getConfig();
    const longBreak = sessionsCompleted > 0 && sessionsCompleted % 4 === 0;
    secondsLeft = longBreak ? config.long : config.short;
    currentSessionDurationMinutes = secondsLeft / 60;
    isBreak = true;
    isRunning = true;
    isPaused = false;
    void vscode.commands.executeCommand('setContext', 'focusTimer.running', true);
    outputChannel.appendLine(`[Focus Timer] Starting ${longBreak ? 'long' : 'short'} break (${currentSessionDurationMinutes}m).`);
    startTicking();
}

function startTicking(): void {
    if (timer) {
        clearInterval(timer);
    }
    updateStatusBar();
    timer = setInterval(() => {
        if (isPaused) {
            return;
        }
        secondsLeft -= 1;
        updateStatusBar();
        if (secondsLeft <= 0) {
            void completeSession();
        }
    }, 1000);
}

async function completeSession(): Promise<void> {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    isRunning = false;
    void vscode.commands.executeCommand('setContext', 'focusTimer.running', false);
    if (!isBreak) {
        sessionsCompleted += 1;
        sessionHistory.push({ type: 'focus', completedAt: new Date().toISOString(), durationMinutes: currentSessionDurationMinutes });
        await persistState();
        updateStatusBar();
        vscode.window.showInformationMessage(
            `Focus session complete (${sessionsCompleted} total).`,
            'Add Note',
            'Start Break'
        ).then(choice => {
            if (choice === 'Add Note') {
                void addNote();
            } else if (choice === 'Start Break') {
                startBreak();
            }
        });
    } else {
        sessionHistory.push({ type: 'break', completedAt: new Date().toISOString(), durationMinutes: currentSessionDurationMinutes });
        await persistState();
        updateStatusBar();
        vscode.window.showInformationMessage('Break complete. Ready to focus?', 'Start Focus').then(choice => {
            if (choice === 'Start Focus') {
                startFocus();
            }
        });
    }
}

function stop(): void {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    isRunning = false;
    isPaused = false;
    void vscode.commands.executeCommand('setContext', 'focusTimer.running', false);
    updateStatusBar();
}

function togglePause(): void {
    if (!isRunning) {
        vscode.window.showInformationMessage('Focus Timer: no active session to pause.');
        return;
    }
    isPaused = !isPaused;
    updateStatusBar();
}

async function addNote(): Promise<void> {
    const latestFocusIndex = sessionHistory.map(session => session.type).lastIndexOf('focus');
    if (latestFocusIndex < 0) {
        vscode.window.showInformationMessage('Complete a focus session before adding a note.');
        return;
    }
    const session = sessionHistory[latestFocusIndex];
    const note = await vscode.window.showInputBox({
        title: 'Focus Timer: Add Session Note',
        prompt: `Add a local note for the focus session completed ${new Date(session.completedAt).toLocaleString()}.`,
        value: session.note ?? '',
        placeHolder: 'For example: finished API error handling'
    });
    if (note === undefined) {
        return;
    }
    session.note = note.trim() || undefined;
    await persistState();
    vscode.window.showInformationMessage('Focus Timer: session note saved locally.');
}

async function resetSessions(): Promise<void> {
    const choice = await vscode.window.showWarningMessage(
        'Reset the locally stored Focus Timer session count and history?',
        { modal: true },
        'Reset History'
    );
    if (choice !== 'Reset History') {
        return;
    }
    sessionsCompleted = 0;
    sessionHistory = [];
    await persistState();
    updateStatusBar();
    vscode.window.showInformationMessage('Focus Timer: local session history reset.');
}

function updateStatusBar(): void {
    if (!isRunning) {
        statusBar.command = 'focusTimer.start';
        const badge = sessionsCompleted ? ` · $(flame)×${sessionsCompleted}` : '';
        statusBar.text = `$(clock) Focus${badge}`;
        statusBar.tooltip = sessionsCompleted
            ? `Focus Timer — ${sessionsCompleted} completed focus session(s) stored locally. Click to start a focus session.`
            : 'Focus Timer — click to start a focus session.';
        return;
    }
    statusBar.command = 'focusTimer.pause';
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    const icon = isBreak ? '$(coffee)' : '$(flame)';
    const paused = isPaused ? ' ⏸' : '';
    const badge = sessionsCompleted ? ` $(flame)×${sessionsCompleted}` : '';
    statusBar.text = `${icon} ${minutes}:${seconds}${paused}${badge}`;
    statusBar.tooltip = `${isBreak ? 'Break' : 'Focus'} — click to ${isPaused ? 'resume' : 'pause'}\nCompleted focus sessions: ${sessionsCompleted}`;
}

function showHistory(): void {
    if (!sessionHistory.length) {
        vscode.window.showInformationMessage('No completed sessions stored yet. Start a focus session.');
        return;
    }
    outputChannel.clear();
    outputChannel.appendLine('Focus Timer — Local Session History');
    outputChannel.appendLine('─'.repeat(56));
    sessionHistory.forEach((session, index) => {
        const note = session.note ? ` — Note: ${session.note}` : '';
        outputChannel.appendLine(`${index + 1}. [${session.type.toUpperCase()}] ${session.durationMinutes}m — ${new Date(session.completedAt).toLocaleString()}${note}`);
    });
    outputChannel.appendLine('─'.repeat(56));
    outputChannel.appendLine(`Completed focus sessions: ${sessionsCompleted}`);
    outputChannel.show();
}

export function deactivate(): void {
    stop();
}
