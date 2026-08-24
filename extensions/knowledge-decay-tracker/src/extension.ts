import * as vscode from 'vscode';
import * as path from 'path';
import { DecayEngine, DecayProfile, DecayScore, type DecayEntry } from '@alex-extensions/shared';

interface ActivityState {
    references: Record<string, number>;
    reviewedAt: Record<string, number>;
}

interface ScannedFile {
    uri: vscode.Uri;
    path: string;
    profile: DecayProfile;
    score: DecayScore;
    lastReviewed: number;
    referenceCount: number;
}

const ACTIVITY_KEY = 'knowledgeDecay.activity';
const EXCLUDED_GLOBS = '**/{node_modules,.git,out,dist,build}/**';

let extensionContext: vscode.ExtensionContext;
let outputChannel: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;
let activity: ActivityState;
let lastScan: ScannedFile[] = [];

export function activate(context: vscode.ExtensionContext): void {
    extensionContext = context;
    outputChannel = vscode.window.createOutputChannel('Knowledge Decay Tracker');
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 92);
    statusBar.command = 'knowledgeDecay.showCritical';
    activity = context.workspaceState.get<ActivityState>(ACTIVITY_KEY) ?? { references: {}, reviewedAt: {} };
    context.subscriptions.push(
        outputChannel,
        statusBar,
        vscode.commands.registerCommand('knowledgeDecay.scanWorkspace', () => scanWorkspace(true)),
        vscode.commands.registerCommand('knowledgeDecay.showReport', showReport),
        vscode.commands.registerCommand('knowledgeDecay.touchFile', (uri?: vscode.Uri) => markFileFresh(uri)),
        vscode.commands.registerCommand('knowledgeDecay.showCritical', showCritical),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor?.document.uri.scheme === 'file') {
                recordReference(editor.document.uri);
            }
        }),
        vscode.workspace.onDidSaveTextDocument(document => {
            if (document.uri.scheme === 'file') {
                recordReference(document.uri);
            }
        })
    );

    if (vscode.window.activeTextEditor?.document.uri.scheme === 'file') {
        recordReference(vscode.window.activeTextEditor.document.uri);
    }
    updateStatusBar();
    if (vscode.workspace.getConfiguration('knowledgeDecay').get<boolean>('autoScan') !== false) {
        void scanWorkspace(false);
    }
    outputChannel.appendLine('[Knowledge Decay Tracker] Activated. Activity and review marks stay in VS Code workspace storage.');
}

function recordReference(uri: vscode.Uri): void {
    const key = uri.toString();
    activity.references[key] = (activity.references[key] ?? 0) + 1;
    void persistActivity();
}

async function persistActivity(): Promise<void> {
    await extensionContext.workspaceState.update(ACTIVITY_KEY, activity);
}

async function scanWorkspace(notify: boolean): Promise<void> {
    const scan = async (): Promise<void> => {
        const config = vscode.workspace.getConfiguration('knowledgeDecay');
        const defaultProfile = (config.get<string>('profile') ?? 'moderate') as DecayProfile;
        const patterns = config.get<string[]>('filePatterns') ?? ['**/*.md'];
        const files = new Map<string, vscode.Uri>();

        for (const pattern of patterns) {
            for (const uri of await vscode.workspace.findFiles(pattern, EXCLUDED_GLOBS, 1000)) {
                files.set(uri.toString(), uri);
            }
        }

        const metadata: { uri: vscode.Uri; stat: vscode.FileStat; tag?: ReturnType<typeof DecayEngine.parseTag> }[] = [];
        for (const uri of files.values()) {
            try {
                const [stat, bytes] = await Promise.all([
                    vscode.workspace.fs.stat(uri),
                    vscode.workspace.fs.readFile(uri)
                ]);
                const header = new TextDecoder().decode(bytes.slice(0, 4096));
                metadata.push({ uri, stat, tag: DecayEngine.parseTag(header) });
            } catch {
                // Skip unreadable or non-text workspace files.
            }
        }

        const maximumReferences = Math.max(
            1,
            ...metadata.map(file => Math.max(1, activity.references[file.uri.toString()] ?? 0))
        );
        lastScan = metadata.map(file => {
            const key = file.uri.toString();
            const profile = file.tag?.profile ?? defaultProfile;
            const lastReviewed = activity.reviewedAt[key] ?? file.tag?.reviewDate?.getTime() ?? file.stat.mtime;
            const referenceCount = Math.max(1, activity.references[key] ?? 0);
            const entry: DecayEntry = {
                id: key,
                lastAccessed: new Date(lastReviewed),
                referenceCount,
                profile
            };
            return {
                uri: file.uri,
                path: vscode.workspace.asRelativePath(file.uri, false),
                profile,
                score: DecayEngine.score(entry, maximumReferences),
                lastReviewed,
                referenceCount
            };
        }).sort((a, b) => a.score.score - b.score.score);

        writeReport();
        updateStatusBar();
        if (notify) {
            const critical = lastScan.filter(file => file.score.tier === 'dormant').length;
            const stale = lastScan.filter(file => file.score.tier === 'fading').length;
            vscode.window.showInformationMessage(
                critical
                    ? `Knowledge Decay: ${critical} critical file(s) need review.`
                    : stale
                        ? `Knowledge Decay: ${stale} file(s) are fading.`
                        : `Knowledge Decay: ${lastScan.length} tracked file(s) are active.`
            );
        }
    };

    if (notify) {
        await vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: 'Knowledge Decay: Scanning workspace...' },
            scan
        );
    } else {
        await scan();
    }
}

function writeReport(): void {
    const groups: Record<'dormant' | 'fading' | 'active' | 'thriving', ScannedFile[]> = {
        dormant: [], fading: [], active: [], thriving: []
    };
    for (const file of lastScan) {
        groups[file.score.tier].push(file);
    }

    outputChannel.clear();
    outputChannel.appendLine(`Knowledge Decay Report — ${new Date().toLocaleString()}`);
    outputChannel.appendLine(`Files scanned: ${lastScan.length}. Score = normalized local activity (60%) + recency (40%).`);
    outputChannel.appendLine('A file starts with one baseline reference; opening or saving it raises its local activity weight.');
    outputChannel.appendLine('─'.repeat(72));
    for (const [tier, files] of Object.entries(groups) as [keyof typeof groups, ScannedFile[]][]) {
        outputChannel.appendLine(`${tier.toUpperCase()} (${files.length})`);
        for (const file of files) {
            outputChannel.appendLine(`  ${file.path} — ${(file.score.score * 100).toFixed(0)}% | ${file.profile} | ${file.referenceCount} activity event(s) | reviewed ${Math.floor(file.score.daysSinceAccess)}d ago`);
        }
    }
}

function showReport(): void {
    if (!lastScan.length) {
        void scanWorkspace(false).then(() => outputChannel.show());
        return;
    }
    outputChannel.show();
}

async function showCritical(): Promise<void> {
    if (!lastScan.length) {
        await scanWorkspace(false);
    }
    const critical = lastScan.filter(file => file.score.tier === 'dormant');
    if (!critical.length) {
        vscode.window.showInformationMessage('Knowledge Decay: no critical files in the latest scan.');
        return;
    }
    const selected = await vscode.window.showQuickPick(critical.map(file => ({
        label: path.basename(file.path),
        description: file.path,
        detail: `${Math.floor(file.score.daysSinceAccess)}d since review · ${(file.score.score * 100).toFixed(0)}% freshness`,
        uri: file.uri
    })), { title: 'Knowledge Decay: Critical Files' });
    if (selected) {
        await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(selected.uri));
    }
}

async function markFileFresh(uri?: vscode.Uri): Promise<void> {
    const target = uri ?? vscode.window.activeTextEditor?.document.uri;
    if (!target || target.scheme !== 'file') {
        vscode.window.showInformationMessage('Open a workspace file to mark it as fresh.');
        return;
    }
    activity.reviewedAt[target.toString()] = Date.now();
    recordReference(target);
    await persistActivity();
    await scanWorkspace(false);
    vscode.window.showInformationMessage(`Knowledge Decay: marked "${path.basename(target.fsPath)}" as freshly reviewed.`);
}

function updateStatusBar(): void {
    const critical = lastScan.filter(file => file.score.tier === 'dormant').length;
    const fading = lastScan.filter(file => file.score.tier === 'fading').length;
    statusBar.text = critical
        ? `$(warning) Knowledge: ${critical}`
        : `$(book) Knowledge${fading ? `: ${fading}` : ''}`;
    statusBar.tooltip = lastScan.length
        ? `Knowledge Decay: ${critical} critical, ${fading} fading file(s) in the latest scan. Click to inspect critical files.`
        : 'Knowledge Decay: scan pending.';
    statusBar.show();
}

export function deactivate(): void {
    statusBar?.dispose();
}
