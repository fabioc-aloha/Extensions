import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;
let timer: ReturnType<typeof setInterval> | undefined;
let secondsLeft = 0;
let isRunning = false;
let isPaused = false;
let isBreak = false;
let sessionsCompleted = 0;
let currentSessionDurationMinutes = 0;
const sessionHistory: { type: string; completedAt: string; durationMinutes: number }[] = [];

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Focus Timer');
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.command = 'focusTimer.pause';
    statusBar.show();
    updateStatusBar();
    context.subscriptions.push(outputChannel, statusBar);

    context.subscriptions.push(
        vscode.commands.registerCommand('focusTimer.start', () => startFocus()),
        vscode.commands.registerCommand('focusTimer.stop', () => stop()),
        vscode.commands.registerCommand('focusTimer.pause', () => togglePause()),
        vscode.commands.registerCommand('focusTimer.startBreak', () => startBreak()),
        vscode.commands.registerCommand('focusTimer.showHistory', () => showHistory())
    );

    outputChannel.appendLine('[Focus Timer] Activated.');
}

function getConfig() {
    const c = vscode.workspace.getConfiguration('focusTimer');
    return {
        work: (c.get<number>('workMinutes') ?? 25) * 60,
        short: (c.get<number>('shortBreakMinutes') ?? 5) * 60,
        long: (c.get<number>('longBreakMinutes') ?? 15) * 60
    };
}

function startFocus(): void {
    if (isRunning) { stop(); }
    const cfg = getConfig();
    secondsLeft = cfg.work;
    currentSessionDurationMinutes = cfg.work / 60;
    isBreak = false;
    isRunning = true;
    isPaused = false;
    outputChannel.appendLine(`[Focus Timer] Starting ${cfg.work / 60}m focus session.`);
    tick();
}

function startBreak(): void {
    if (isRunning) { stop(); }
    const cfg = getConfig();
    const isLong = sessionsCompleted > 0 && sessionsCompleted % 4 === 0;
    secondsLeft = isLong ? cfg.long : cfg.short;
    currentSessionDurationMinutes = (isLong ? cfg.long : cfg.short) / 60;
    isBreak = true;
    isRunning = true;
    isPaused = false;
    outputChannel.appendLine(`[Focus Timer] Starting ${isLong ? 'long' : 'short'} break (${currentSessionDurationMinutes}m).`);
    tick();
}

function tick(): void {
    timer = setInterval(() => {
        if (isPaused) { return; }
        secondsLeft--;
        updateStatusBar();
        if (secondsLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            if (!isBreak) {
                sessionsCompleted++;
                sessionHistory.push({ type: 'focus', completedAt: new Date().toISOString(), durationMinutes: getConfig().work / 60 });
                vscode.window.showInformationMessage(`🍅 Focus session complete! (${sessionsCompleted} total)`, 'Start Break').then(c => { if (c) startBreak(); });
            } else {
                sessionHistory.push({ type: 'break', completedAt: new Date().toISOString(), durationMinutes: currentSessionDurationMinutes });
                vscode.window.showInformationMessage('☕ Break over! Ready to focus?', 'Start Focus').then(c => { if (c) startFocus(); });
            }
            updateStatusBar();
        }
    }, 1000);
}

function stop(): void {
    if (timer) { clearInterval(timer); timer = undefined; }
    isRunning = false;
    isPaused = false;
    updateStatusBar();
}

function togglePause(): void {
    if (!isRunning) { startFocus(); return; }
    isPaused = !isPaused;
    updateStatusBar();
}

function updateStatusBar(): void {
    if (!isRunning) {
        statusBar.text = '$(clock) Focus Timer';
        statusBar.tooltip = 'Click to start a focus session';
        return;
    }
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    const icon = isBreak ? '$(coffee)' : '$(flame)';
    const paused = isPaused ? ' ⏸' : '';
    statusBar.text = `${icon} ${m}:${s}${paused}`;
    statusBar.tooltip = `${isBreak ? 'Break' : 'Focus'} — click to ${isPaused ? 'resume' : 'pause'}`;
}

function showHistory(): void {
    if (sessionHistory.length === 0) {
        vscode.window.showInformationMessage('No sessions completed yet. Start a focus session!');
        return;
    }
    outputChannel.clear();
    outputChannel.appendLine('Focus Timer — Session History');
    outputChannel.appendLine('─'.repeat(40));
    sessionHistory.forEach((s, i) => {
        outputChannel.appendLine(`${i + 1}. [${s.type.toUpperCase()}] ${s.durationMinutes}m — ${new Date(s.completedAt).toLocaleString()}`);
    });
    outputChannel.appendLine('─'.repeat(40));
    outputChannel.appendLine(`Total focus sessions: ${sessionsCompleted}`);
    outputChannel.show();
}

export function deactivate(): void {
    stop();
    outputChannel?.appendLine('[Focus Timer] Deactivated.');
}
