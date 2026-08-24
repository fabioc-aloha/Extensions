import * as vscode from 'vscode';
import * as path from 'path';

type StallSeverity = 'warning' | 'alert' | 'critical';

interface FileObservation {
    path: string;
    uri: string;
    openCount: number;
    lastOpened: number;
    uncommittedSince?: number;
    todoCount: number;
    fixmeCount: number;
}

interface ObservationStore {
    observations: Record<string, FileObservation>;
}

interface GitChange {
    uri: vscode.Uri;
}

interface GitRepository {
    state: {
        workingTreeChanges: readonly GitChange[];
        indexChanges: readonly GitChange[];
    };
}

interface GitApi {
    repositories: readonly GitRepository[];
}

interface GitExtension {
    getAPI(version: 1): GitApi;
}

const STORAGE_KEY = 'workspaceWatchdog.observations';
const TODO_FILE_GLOB = '**/*.{ts,tsx,js,jsx,md,json,yaml,yml,py,go,java,cs}';
const EXCLUDED_GLOBS = '**/{node_modules,.git,out,dist,build}/**';
const STALL_THRESHOLDS = { warning: 1, alert: 3, critical: 7 };

let extensionContext: vscode.ExtensionContext;
let outputChannel: vscode.OutputChannel;
let store: ObservationStore;
let treeProvider: WatchdogTreeProvider;
let scanInterval: ReturnType<typeof setInterval> | undefined;

class WatchdogTreeItem extends vscode.TreeItem {
    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        readonly group?: 'hot' | 'stalled' | 'todos',
        readonly observation?: FileObservation,
        detail?: string
    ) {
        super(label, collapsibleState);
        this.description = detail;
        if (observation) {
            this.tooltip = `${observation.path}\n${detail ?? ''}`.trim();
            this.command = {
                command: 'workspaceWatchdog.openFile',
                title: 'Open File',
                arguments: [observation.uri]
            };
            this.iconPath = vscode.ThemeIcon.File;
        }
    }
}

class WatchdogTreeProvider implements vscode.TreeDataProvider<WatchdogTreeItem> {
    private readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<WatchdogTreeItem | undefined>();
    readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

    refresh(): void {
        this.onDidChangeTreeDataEmitter.fire(undefined);
    }

    getTreeItem(element: WatchdogTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: WatchdogTreeItem): WatchdogTreeItem[] {
        if (!element) {
            const stalled = getStalledFiles();
            const hot = getHotFiles();
            const todos = getTodoHotspots();
            const health = getHealthTier(stalled);
            return [
                new WatchdogTreeItem(`Health: ${health.toUpperCase()}`, vscode.TreeItemCollapsibleState.None, undefined, undefined, 'Derived from stalled Git changes'),
                new WatchdogTreeItem(`Hot Files (${hot.length})`, hot.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, 'hot'),
                new WatchdogTreeItem(`Stalled Changes (${stalled.length})`, stalled.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, 'stalled'),
                new WatchdogTreeItem(`TODO Hotspots (${todos.length})`, todos.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, 'todos')
            ];
        }

        if (element.group === 'hot') {
            return getHotFiles().map(file => new WatchdogTreeItem(
                path.basename(file.path),
                vscode.TreeItemCollapsibleState.None,
                undefined,
                file,
                `Opened ${file.openCount} times in the last 7 days`
            ));
        }
        if (element.group === 'stalled') {
            return getStalledFiles().map(stalled => new WatchdogTreeItem(
                `[${stalled.severity.toUpperCase()}] ${path.basename(stalled.file.path)}`,
                vscode.TreeItemCollapsibleState.None,
                undefined,
                stalled.file,
                `Uncommitted for ${Math.floor(stalled.daysStalled)} day(s)`
            ));
        }
        if (element.group === 'todos') {
            return getTodoHotspots().map(file => new WatchdogTreeItem(
                path.basename(file.path),
                vscode.TreeItemCollapsibleState.None,
                undefined,
                file,
                `${file.todoCount} TODO, ${file.fixmeCount} FIXME`
            ));
        }
        return [];
    }
}

export function activate(context: vscode.ExtensionContext): void {
    extensionContext = context;
    outputChannel = vscode.window.createOutputChannel('Workspace Watchdog');
    store = context.workspaceState.get<ObservationStore>(STORAGE_KEY) ?? { observations: {} };
    treeProvider = new WatchdogTreeProvider();
    context.subscriptions.push(
        outputChannel,
        vscode.window.createTreeView('workspaceWatchdog.fileHealth', { treeDataProvider: treeProvider }),
        vscode.commands.registerCommand('workspaceWatchdog.showDashboard', showDashboard),
        vscode.commands.registerCommand('workspaceWatchdog.scanNow', () => runScan(true)),
        vscode.commands.registerCommand('workspaceWatchdog.showHotFiles', showHotFiles),
        vscode.commands.registerCommand('workspaceWatchdog.showStalledFiles', showStalledFiles),
        vscode.commands.registerCommand('workspaceWatchdog.clearHistory', clearHistory),
        vscode.commands.registerCommand('workspaceWatchdog.openFile', openFile),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor?.document.uri.scheme === 'file') {
                recordOpen(editor.document.uri);
            }
        })
    );

    if (vscode.window.activeTextEditor?.document.uri.scheme === 'file') {
        recordOpen(vscode.window.activeTextEditor.document.uri);
    }
    void runScan(false);
    scanInterval = setInterval(() => void runScan(false), 30 * 60 * 1000);
    context.subscriptions.push({ dispose: () => scanInterval && clearInterval(scanInterval) });
    outputChannel.appendLine('[Workspace Watchdog] Activated. Observations stay in VS Code workspace storage.');
}

async function runScan(showProgress: boolean): Promise<void> {
    const scan = async (): Promise<void> => {
        const changedUris = await getChangedUris();
        const changed = new Set(changedUris.map(uri => uri.toString()));

        for (const uri of changedUris) {
            const observation = ensureObservation(uri);
            observation.uncommittedSince ??= Date.now();
        }
        for (const observation of Object.values(store.observations)) {
            if (!changed.has(observation.uri)) {
                delete observation.uncommittedSince;
            }
        }

        const files = await vscode.workspace.findFiles(TODO_FILE_GLOB, EXCLUDED_GLOBS, 500);
        for (const uri of files) {
            try {
                const text = new TextDecoder().decode(await vscode.workspace.fs.readFile(uri));
                const todoCount = (text.match(/\bTODO\b/gi) ?? []).length;
                const fixmeCount = (text.match(/\bFIXME\b/gi) ?? []).length;
                const existing = getObservation(uri);
                if (existing || todoCount + fixmeCount > 0) {
                    const observation = existing ?? ensureObservation(uri);
                    observation.todoCount = todoCount;
                    observation.fixmeCount = fixmeCount;
                }
            } catch {
                // Non-text or unreadable files are not part of this signal.
            }
        }

        await persist();
        treeProvider.refresh();
        const stalled = getStalledFiles();
        outputChannel.appendLine(`[Watchdog] Git changes: ${changed.size} | tracked TODO files: ${getTodoHotspots().length} | stalled: ${stalled.length}`);
        if (showProgress) {
            vscode.window.showInformationMessage(`Workspace Watchdog: scanned ${files.length} text file(s); ${stalled.length} stalled change(s).`);
        }
    };

    if (showProgress) {
        await vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: 'Workspace Watchdog: Scanning workspace...' },
            scan
        );
    } else {
        await scan();
    }
}

async function getChangedUris(): Promise<vscode.Uri[]> {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
    if (!gitExtension) {
        outputChannel.appendLine('[Watchdog] Built-in Git extension unavailable; stalled-change signal skipped.');
        return [];
    }

    try {
        if (!gitExtension.isActive) {
            await gitExtension.activate();
        }
        const api = gitExtension.exports.getAPI(1);
        const uris = new Map<string, vscode.Uri>();
        for (const repository of api.repositories) {
            for (const change of [...repository.state.workingTreeChanges, ...repository.state.indexChanges]) {
                if (change.uri.scheme === 'file') {
                    uris.set(change.uri.toString(), change.uri);
                }
            }
        }
        return [...uris.values()];
    } catch {
        outputChannel.appendLine('[Watchdog] Could not read Git changes; stalled-change signal skipped for this scan.');
        return [];
    }
}

function getObservation(uri: vscode.Uri): FileObservation | undefined {
    return store.observations[uri.toString()];
}

function ensureObservation(uri: vscode.Uri): FileObservation {
    const key = uri.toString();
    const existing = store.observations[key];
    if (existing) {
        return existing;
    }
    const observation: FileObservation = {
        path: vscode.workspace.asRelativePath(uri, false),
        uri: key,
        openCount: 0,
        lastOpened: Date.now(),
        todoCount: 0,
        fixmeCount: 0
    };
    store.observations[key] = observation;
    return observation;
}

function recordOpen(uri: vscode.Uri): void {
    if (!vscode.workspace.getWorkspaceFolder(uri)) {
        return;
    }
    const observation = ensureObservation(uri);
    observation.openCount += 1;
    observation.lastOpened = Date.now();
    void persist();
    treeProvider?.refresh();
}

async function persist(): Promise<void> {
    await extensionContext.workspaceState.update(STORAGE_KEY, store);
}

function getHotFiles(): FileObservation[] {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return Object.values(store.observations)
        .filter(file => file.openCount >= 5 && file.lastOpened >= cutoff)
        .sort((a, b) => b.openCount - a.openCount);
}

function getStalledFiles(): { file: FileObservation; daysStalled: number; severity: StallSeverity }[] {
    return Object.values(store.observations)
        .filter(file => file.uncommittedSince !== undefined)
        .map(file => {
            const daysStalled = (Date.now() - file.uncommittedSince!) / (24 * 60 * 60 * 1000);
            const severity: StallSeverity = daysStalled >= STALL_THRESHOLDS.critical
                ? 'critical'
                : daysStalled >= STALL_THRESHOLDS.alert
                    ? 'alert'
                    : 'warning';
            return { file, daysStalled, severity };
        })
        .filter(stalled => stalled.daysStalled >= STALL_THRESHOLDS.warning)
        .sort((a, b) => b.daysStalled - a.daysStalled);
}

function getTodoHotspots(): FileObservation[] {
    return Object.values(store.observations)
        .filter(file => file.todoCount + file.fixmeCount >= 3)
        .sort((a, b) => (b.todoCount + b.fixmeCount) - (a.todoCount + a.fixmeCount));
}

function getHealthTier(stalled = getStalledFiles()): 'green' | 'yellow' | 'red' {
    if (stalled.some(file => file.severity === 'critical')) {
        return 'red';
    }
    return stalled.length > 3 ? 'yellow' : 'green';
}

function showDashboard(): void {
    const stalled = getStalledFiles();
    const hot = getHotFiles();
    const todos = getTodoHotspots();
    const section = (title: string, lines: string[]): string[] => [title, ...(lines.length ? lines : ['  None']), ''];
    const lines = [
        'Workspace Watchdog Dashboard',
        `Health: ${getHealthTier(stalled).toUpperCase()}`,
        '',
        ...section('Hot Files (opened at least 5 times in 7 days)', hot.map(file => `  ${file.path} (${file.openCount} opens)`)),
        ...section('Stalled Git Changes (uncommitted for at least 1 day)', stalled.map(file => `  [${file.severity.toUpperCase()}] ${file.file.path} (${Math.floor(file.daysStalled)}d)`)),
        ...section('TODO / FIXME Hotspots (at least 3)', todos.map(file => `  ${file.path} (${file.todoCount} TODO, ${file.fixmeCount} FIXME)`))
    ];
    outputChannel.clear();
    outputChannel.appendLine(lines.join('\n'));
    outputChannel.show();
}

async function showHotFiles(): Promise<void> {
    const items = getHotFiles();
    if (!items.length) {
        vscode.window.showInformationMessage('No hot files yet. Open a workspace file at least five times within seven days.');
        return;
    }
    const selected = await vscode.window.showQuickPick(items.map(file => ({
        label: path.basename(file.path),
        description: file.path,
        detail: `Opened ${file.openCount} times`,
        uri: file.uri
    })), { title: 'Workspace Watchdog: Hot Files' });
    if (selected) {
        await openFile(selected.uri);
    }
}

async function showStalledFiles(): Promise<void> {
    const items = getStalledFiles();
    if (!items.length) {
        vscode.window.showInformationMessage('No Git changes have been uncommitted for at least one day.');
        return;
    }
    const selected = await vscode.window.showQuickPick(items.map(stalled => ({
        label: `[${stalled.severity.toUpperCase()}] ${path.basename(stalled.file.path)}`,
        description: stalled.file.path,
        detail: `Uncommitted for ${Math.floor(stalled.daysStalled)} day(s)`,
        uri: stalled.file.uri
    })), { title: 'Workspace Watchdog: Stalled Changes' });
    if (selected) {
        await openFile(selected.uri);
    }
}

async function openFile(uriText: string): Promise<void> {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(uriText));
    await vscode.window.showTextDocument(document);
}

async function clearHistory(): Promise<void> {
    const choice = await vscode.window.showWarningMessage(
        'Clear all local Workspace Watchdog observations for this workspace?',
        { modal: true },
        'Clear Observations'
    );
    if (choice !== 'Clear Observations') {
        return;
    }
    store = { observations: {} };
    await persist();
    treeProvider.refresh();
    outputChannel.appendLine('[Watchdog] Local workspace observations cleared.');
    vscode.window.showInformationMessage('Workspace Watchdog: local observations cleared.');
}

export function deactivate(): void {
    if (scanInterval) {
        clearInterval(scanInterval);
    }
}
