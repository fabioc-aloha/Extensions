import * as vscode from 'vscode';
import { HookStudioPanel } from './panels/hookStudioPanel';
import { HookLogProvider } from './providers/hookLogProvider';

export function activate(context: vscode.ExtensionContext): void {
    const outputChannel = vscode.window.createOutputChannel('Hook Studio');
    const logProvider = new HookLogProvider();

    context.subscriptions.push(

        vscode.commands.registerCommand('hookStudio.open', () => {
            HookStudioPanel.createOrShow(context, outputChannel);
        }),

        vscode.commands.registerCommand('hookStudio.testCondition', async () => {
            const toolName = await vscode.window.showInputBox({
                prompt: 'Enter tool name to simulate (e.g., createFile, runTerminal)',
                placeHolder: 'createFile',
            });
            if (!toolName) { return; }
            HookStudioPanel.createOrShow(context, outputChannel);
            HookStudioPanel.simulateTool(toolName);
        }),

        vscode.commands.registerCommand('hookStudio.importFromAlex', async () => {
            const workspaces = vscode.workspace.workspaceFolders;
            if (!workspaces) {
                vscode.window.showErrorMessage('No workspace folder open.');
                return;
            }
            const hooksPath = vscode.Uri.joinPath(workspaces[0].uri, '.github', 'hooks.json');
            try {
                await vscode.workspace.fs.stat(hooksPath);
                HookStudioPanel.createOrShow(context, outputChannel);
                HookStudioPanel.loadFile(hooksPath);
                outputChannel.appendLine(`[Hook Studio] Loaded hooks.json from ${hooksPath.fsPath}`);
            } catch {
                vscode.window.showErrorMessage('hooks.json not found at .github/hooks.json in this workspace.');
            }
        }),

        vscode.commands.registerCommand('hookStudio.exportHooks', async () => {
            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file('hooks.json'),
                filters: { 'JSON': ['json'] },
            });
            if (!uri) { return; }
            HookStudioPanel.exportTo(uri);
            outputChannel.appendLine(`[Hook Studio] Exported hooks.json to ${uri.fsPath}`);
        }),

        vscode.commands.registerCommand('hookStudio.openLog', () => {
            outputChannel.show();
        }),

        // Watch .github/hooks.json for external changes
        ...createHooksWatcher(outputChannel),

        outputChannel,
        logProvider,
    );

    outputChannel.appendLine('[Hook Studio] Extension activated. VS Code 1.109+ required for agent hooks.');
}

function createHooksWatcher(outputChannel: vscode.OutputChannel): vscode.Disposable[] {
    const watcher = vscode.workspace.createFileSystemWatcher('**/.github/hooks.json');
    const disposables: vscode.Disposable[] = [
        watcher.onDidChange(uri => {
            outputChannel.appendLine(`[Hook Studio] hooks.json changed: ${uri.fsPath}`);
            HookStudioPanel.notifyFileChanged(uri);
        }),
        watcher.onDidCreate(uri => {
            outputChannel.appendLine(`[Hook Studio] hooks.json created: ${uri.fsPath}`);
        }),
        watcher,
    ];
    return disposables;
}

export function deactivate(): void { /* nothing to clean up */ }
