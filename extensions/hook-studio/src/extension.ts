import * as vscode from 'vscode';
import { HookStudioPanel } from './panels/hookStudioPanel';
import { HookLogProvider } from './providers/hookLogProvider';

const HOOK_EVENTS = new Set([
    'SessionStart',
    'UserPromptSubmit',
    'PreToolUse',
    'PostToolUse',
    'PreCompact',
    'SubagentStart',
    'SubagentStop',
    'Stop'
]);

const RECIPES = [
    {
        label: 'Run formatter after file edits',
        event: 'PostToolUse',
        command: 'npm run format',
        description: 'Runs a project formatter after an agent tool completes.'
    },
    {
        label: 'Run tests before stopping',
        event: 'Stop',
        command: 'npm test',
        description: 'Runs the test command when an agent stops.'
    },
    {
        label: 'Audit tool use',
        event: 'PostToolUse',
        command: 'echo "$TOOL_NAME completed"',
        description: 'Adds a simple command-based audit action after tool use.'
    }
] as const;

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

        vscode.commands.registerCommand('hookStudio.validateWorkspaceHooks', () =>
            validateWorkspaceHooks(outputChannel)
        ),

        vscode.commands.registerCommand('hookStudio.migrateLegacyHooks', () =>
            migrateLegacyHooks(outputChannel)
        ),

        vscode.commands.registerCommand('hookStudio.createRecipe', () =>
            createRecipe(outputChannel)
        ),

        ...createHooksWatcher(outputChannel),

        outputChannel,
        logProvider,
    );

    outputChannel.appendLine('[Hook Studio] Extension activated. VS Code 1.109+ required for agent hooks.');
}

function createHooksWatcher(outputChannel: vscode.OutputChannel): vscode.Disposable[] {
    const watcher = vscode.workspace.createFileSystemWatcher('**/.github/{hooks.json,hooks/**/*.json}');
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

async function migrateLegacyHooks(outputChannel: vscode.OutputChannel): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!workspaceRoot) {
        vscode.window.showWarningMessage('Hook Studio: Open a workspace folder first.');
        return;
    }

        const legacyUri = vscode.Uri.joinPath(workspaceRoot, '.github', 'hooks.json');
        try {
            const legacyContent = Buffer.from(await vscode.workspace.fs.readFile(legacyUri)).toString('utf8');
            const legacyDocument = JSON.parse(legacyContent) as { hooks?: unknown };
            if (!legacyDocument.hooks) {
                throw new Error('The legacy file has no hooks property.');
            }
            const destination = vscode.Uri.joinPath(workspaceRoot, '.github', 'hooks', 'migrated.json');
            try {
                await vscode.workspace.fs.stat(destination);
                vscode.window.showErrorMessage('Hook Studio: .github/hooks/migrated.json already exists. Rename or remove it before migrating.');
                return;
            } catch {
                // The migration target must not overwrite an existing current hook file.
            }
            const confirm = await vscode.window.showWarningMessage(
                'Create .github/hooks/migrated.json from the legacy hooks.json? The legacy file will remain unchanged.',
                { modal: true },
                'Create Migration File'
            );
            if (confirm !== 'Create Migration File') { return; }
            await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(workspaceRoot, '.github', 'hooks'));
            await vscode.workspace.fs.writeFile(destination, Buffer.from(JSON.stringify(legacyDocument, null, 2), 'utf8'));
            outputChannel.appendLine(`Hook Studio: created ${vscode.workspace.asRelativePath(destination)}. Review and validate it before removing the legacy file.`);
            vscode.window.showInformationMessage('Hook Studio: migration file created. Validate it before removing the legacy file.', 'Open File').then(choice => {
                if (choice === 'Open File') { vscode.window.showTextDocument(destination); }
            });
        } catch (err) {
            vscode.window.showErrorMessage(`Hook Studio: legacy migration failed. ${err instanceof Error ? err.message : String(err)}`);
        }
}

async function createRecipe(outputChannel: vscode.OutputChannel): Promise<void> {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
        if (!workspaceRoot) {
            vscode.window.showWarningMessage('Hook Studio: Open a workspace folder first.');
            return;
        }
        const recipe = await vscode.window.showQuickPick(RECIPES, {
            title: 'Hook Studio - Create Recipe',
            placeHolder: 'Select a starter recipe to add as a current-layout hook file'
        });
        if (!recipe) { return; }
        const fileName = `${recipe.event.toLowerCase()}-recipe.json`;
        const destination = vscode.Uri.joinPath(workspaceRoot, '.github', 'hooks', fileName);
        try {
            await vscode.workspace.fs.stat(destination);
            vscode.window.showErrorMessage(`Hook Studio: ${vscode.workspace.asRelativePath(destination)} already exists.`);
            return;
        } catch {
            // Recipes should be additive and never overwrite existing hook files.
        }
        const document = {
            hooks: {
                [recipe.event]: [{ type: 'command', command: recipe.command, timeout: 30 }]
            }
        };
        await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(workspaceRoot, '.github', 'hooks'));
        await vscode.workspace.fs.writeFile(destination, Buffer.from(JSON.stringify(document, null, 2), 'utf8'));
        outputChannel.appendLine(`Hook Studio: created ${recipe.label} at ${vscode.workspace.asRelativePath(destination)}.`);
        vscode.window.showInformationMessage(`Hook Studio: created ${recipe.label}. Review the command before enabling it.`, 'Open File').then(choice => {
            if (choice === 'Open File') { vscode.window.showTextDocument(destination); }
        });
}

async function validateWorkspaceHooks(outputChannel: vscode.OutputChannel): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!workspaceRoot) {
        vscode.window.showWarningMessage('Hook Studio: Open a workspace folder first.');
        return;
    }
    const currentHooks = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceRoot, '.github/hooks/**/*.json')
    );
    const legacyHooks = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceRoot, '.github/hooks.json')
    );
    const files = [...currentHooks, ...legacyHooks];
    if (files.length === 0) {
        vscode.window.showWarningMessage('Hook Studio: No hook files found in .github/hooks/*.json or .github/hooks.json.');
        return;
    }

    const issues: string[] = [];
    for (const file of files) {
        const content = Buffer.from(await vscode.workspace.fs.readFile(file)).toString('utf8');
        issues.push(...validateHookDocument(content, vscode.workspace.asRelativePath(file)));
    }

    outputChannel.clear();
    outputChannel.appendLine(`Hook Studio: validated ${files.length} hook file(s).`);
    if (issues.length === 0) {
        outputChannel.appendLine('No static schema issues found.');
        vscode.window.showInformationMessage(`Hook Studio: ${files.length} hook file(s) passed static validation.`);
    } else {
        issues.forEach(issue => outputChannel.appendLine(`- ${issue}`));
        vscode.window.showWarningMessage(`Hook Studio: found ${issues.length} validation issue(s). See the Hook Studio output.`);
    }
    outputChannel.show();
}

function validateHookDocument(content: string, fileName: string): string[] {
    let document: unknown;
    try {
        document = JSON.parse(content);
    } catch (err) {
        return [`${fileName}: invalid JSON (${err instanceof Error ? err.message : String(err)}).`];
    }

    if (!document || typeof document !== 'object' || Array.isArray(document)) {
        return [`${fileName}: hook document must be a JSON object.`];
    }
    const hooks = (document as { hooks?: unknown }).hooks;
    if (!hooks || typeof hooks !== 'object' || Array.isArray(hooks)) {
        return [`${fileName}: expected a hooks object keyed by lifecycle event.`];
    }

    const issues: string[] = [];
    for (const [event, entries] of Object.entries(hooks as Record<string, unknown>)) {
        if (!HOOK_EVENTS.has(event)) {
            issues.push(`${fileName}: ${event} is not a recognized VS Code hook event.`);
        }
        const actions = Array.isArray(entries) ? entries : [entries];
        actions.forEach((action, index) => {
            if (!action || typeof action !== 'object') {
                issues.push(`${fileName}: ${event}[${index}] must be a hook action object.`);
                return;
            }
            const candidate = action as { type?: unknown; command?: unknown };
            if (candidate.type !== 'command') {
                issues.push(`${fileName}: ${event}[${index}] must declare type: "command".`);
            }
            if (typeof candidate.command !== 'string' || !candidate.command.trim()) {
                issues.push(`${fileName}: ${event}[${index}] must declare a non-empty command.`);
            }
        });
    }
    return issues;
}

export function deactivate(): void { /* nothing to clean up */ }
