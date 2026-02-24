import * as vscode from 'vscode';
import * as path from 'path';
// pptxgenjs loaded as runtime dependency
// import PptxGenJS = require('pptxgenjs');

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('PPTX Builder');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('pptxBuilder.create', () => createPresentation()),
        vscode.commands.registerCommand('pptxBuilder.newTemplate', () => newTemplate()),
        vscode.commands.registerCommand('pptxBuilder.preview', () => previewStructure()),
        vscode.commands.registerCommand('pptxBuilder.openDocs', () => {
            vscode.env.openExternal(vscode.Uri.parse('https://gitbrent.github.io/PptxGenJS/'));
        })
    );

    outputChannel.appendLine('[PPTX Builder] Activated.');
}

async function createPresentation(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { vscode.window.showWarningMessage('Open a Markdown file first.'); return; }

    const text = editor.document.getText();
    const slides = parseMarkdownToSlides(text);

    if (slides.length === 0) { vscode.window.showWarningMessage('No H2 headings (##) found — each ## becomes a slide.'); return; }

    try {
        // Dynamically import pptxgenjs to avoid bundling issues
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const PptxGenJS = require('pptxgenjs');
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';

        for (const slide of slides) {
            const s = pptx.addSlide();
            s.addText(slide.title, { x: 0.5, y: 0.3, w: '90%', h: 1.2, fontSize: 36, bold: true, color: '363636' });
            if (slide.content) {
                s.addText(slide.content, { x: 0.5, y: 1.8, w: '90%', h: 4.5, fontSize: 18, color: '404040' });
            }
            if (slide.notes) { s.addNotes(slide.notes); }
        }

        const outputPath = editor.document.uri.fsPath.replace(/\.md$/, '.pptx');
        await pptx.writeFile({ fileName: outputPath });
        outputChannel.appendLine(`✅ Created: ${outputPath} (${slides.length} slides)`);
        vscode.window.showInformationMessage(`✅ Created ${slides.length}-slide presentation!`, 'Open Folder').then(c => {
            if (c) { vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath)); }
        });
    } catch (err) {
        vscode.window.showErrorMessage(`PPTX Builder error: ${err}. Run 'npm install pptxgenjs' in the extension folder.`);
    }
}

function parseMarkdownToSlides(md: string): { title: string; content: string; notes: string }[] {
    const slides: { title: string; content: string; notes: string }[] = [];
    const sections = md.split(/^##\s+/m).slice(1);
    for (const section of sections) {
        const lines = section.split('\n');
        const title = lines[0].trim();
        const rest = lines.slice(1).join('\n');
        const noteMatch = rest.match(/<!--notes:([\s\S]*?)-->/);
        const notes = noteMatch ? noteMatch[1].trim() : '';
        const content = rest.replace(/<!--notes:[\s\S]*?-->/, '').replace(/[*_`#]/g, '').trim();
        slides.push({ title, content: content.slice(0, 800), notes });
    }
    return slides;
}

async function newTemplate(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) { return; }
    const template = `# Presentation Title\n\n## Slide 1: Introduction\n\nYour content here.\n\n## Slide 2: Key Points\n\n- Point one\n- Point two\n- Point three\n\n## Slide 3: Summary\n\nConclusion text.\n<!--notes: Speaker notes go here -->\n`;
    const uri = vscode.Uri.file(path.join(workspaceRoot, 'presentation.md'));
    await vscode.workspace.fs.writeFile(uri, Buffer.from(template));
    vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}

function previewStructure(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const slides = parseMarkdownToSlides(editor.document.getText());
    outputChannel.clear();
    outputChannel.appendLine(`PPTX Preview — ${slides.length} slides:`);
    slides.forEach((s, i) => outputChannel.appendLine(`  Slide ${i + 1}: ${s.title}`));
    outputChannel.show();
}

export function deactivate(): void {
    outputChannel?.appendLine('[PPTX Builder] Deactivated.');
}
