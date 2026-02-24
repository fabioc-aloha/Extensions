import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('My Extension');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from My Extension!');
            outputChannel.appendLine('[My Extension] Hello World command executed.');
        })
    );

    outputChannel.appendLine('[My Extension] Activated.');
}

export function deactivate(): void {
    outputChannel?.appendLine('[My Extension] Deactivated.');
}
