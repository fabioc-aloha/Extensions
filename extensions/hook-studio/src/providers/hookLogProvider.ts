import * as vscode from 'vscode';

/**
 * Tree data provider for the Hook Execution Log view.
 * Surfaces hook events in the Explorer sidebar.
 */
export interface HookLogEntry {
    hookId: string;
    tool: string;
    event: 'before' | 'after';
    timestamp: number;
    status: 'success' | 'failure' | 'skipped';
    message?: string;
}

export class HookLogProvider implements vscode.TreeDataProvider<HookLogEntry> {
    private _onDidChangeTreeData = new vscode.EventEmitter<HookLogEntry | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private entries: HookLogEntry[] = [];

    addEntry(entry: HookLogEntry): void {
        this.entries.unshift(entry);
        if (this.entries.length > 200) { this.entries.pop(); }
        this._onDidChangeTreeData.fire();
    }

    clear(): void {
        this.entries = [];
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HookLogEntry): vscode.TreeItem {
        const icon = element.status === 'success' ? '✅'
            : element.status === 'failure' ? '❌'
            : '⏭';
        const label = `${icon} [${element.event}] ${element.tool}`;
        const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
        item.description = new Date(element.timestamp).toLocaleTimeString();
        item.tooltip = element.message ?? `Hook: ${element.hookId}`;
        return item;
    }

    getChildren(_element?: HookLogEntry): HookLogEntry[] {
        return _element ? [] : this.entries;
    }
}
