import * as vscode from 'vscode';
import * as path from 'path';
// pptxgenjs loaded as runtime dependency
// import PptxGenJS = require('pptxgenjs');

let outputChannel: vscode.OutputChannel;

interface PresentationTheme {
    id: 'cxNavy' | 'corporate' | 'minimal';
    label: string;
    background: string;
    title: string;
    body: string;
    accent: string;
}

const THEMES: PresentationTheme[] = [
    { id: 'cxNavy', label: 'CX Navy', background: '0F172A', title: 'F8FAFC', body: 'CBD5E1', accent: '2DD4BF' },
    { id: 'corporate', label: 'Corporate', background: 'FFFFFF', title: '0F172A', body: '334155', accent: '0EA5E9' },
    { id: 'minimal', label: 'Minimal', background: 'FAFAF9', title: '1C1917', body: '44403C', accent: 'F97316' }
];

export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('PPTX Builder');
    context.subscriptions.push(outputChannel);

    context.subscriptions.push(
        vscode.commands.registerCommand('pptxBuilder.create', () => createPresentation()),
        vscode.commands.registerCommand('pptxBuilder.newTemplate', () => newTemplate()),
        vscode.commands.registerCommand('pptxBuilder.preview', () => previewStructure()),
        vscode.commands.registerCommand('pptxBuilder.selectTheme', () => selectTheme()),
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
    const slides = expandSlides(parseMarkdownToSlides(text));

    if (slides.length === 0) { vscode.window.showWarningMessage('No H2 headings (##) found — each ## becomes a slide.'); return; }

    try {
        // Dynamically import pptxgenjs to avoid bundling issues
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const PptxGenJS = require('pptxgenjs');
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        const theme = getTheme();

        for (const slide of slides) {
            const s = pptx.addSlide();
            s.background = { color: theme.background };
            s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.45, w: 1.25, h: 0.08, fill: { color: theme.accent }, line: { color: theme.accent } });
            s.addText(slide.title, { x: 0.5, y: 0.35, w: '90%', h: 1, fontSize: 32, bold: true, color: theme.title });
            if (slide.content) {
                s.addText(slide.content, { x: 0.5, y: 1.85, w: '90%', h: 4.7, fontSize: 18, color: theme.body, valign: 'top' });
            }
            if (slide.notes) { s.addNotes(slide.notes); }
        }

        const outputPath = editor.document.uri.fsPath.replace(/\.md$/, '.pptx');
        await pptx.writeFile({ fileName: outputPath });
        outputChannel.appendLine(`✅ Created: ${outputPath} (${slides.length} slides, ${theme.label} theme)`);
        vscode.window.showInformationMessage(`✅ Created ${slides.length}-slide presentation!`, 'Open Folder').then(c => {
            if (c) { vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath)); }
        });
    } catch (err) {
        vscode.window.showErrorMessage(`PPTX Builder error: ${err}`);
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
        slides.push({ title, content, notes });
    }
    return slides;
}

function expandSlides(slides: { title: string; content: string; notes: string }[]): { title: string; content: string; notes: string }[] {
    return slides.flatMap(slide => {
        const sections = splitContent(slide.content);
        return sections.map((content, index) => ({
            title: index === 0 ? slide.title : `${slide.title} (continued)`,
            content,
            notes: index === 0 ? slide.notes : ''
        }));
    });
}

function splitContent(content: string): string[] {
    if (!content) { return ['']; }
    const sections: string[] = [];
    let current = '';

    for (const paragraph of content.split(/\n\s*\n/)) {
        const normalized = paragraph.trim();
        if (!normalized) { continue; }
        if (current && current.length + normalized.length + 2 > 700) {
            sections.push(current);
            current = normalized;
        } else {
            current = current ? `${current}\n\n${normalized}` : normalized;
        }
    }
    if (current) { sections.push(current); }
    return sections.length > 0 ? sections : [''];
}

function getTheme(): PresentationTheme {
    const configured = vscode.workspace.getConfiguration('pptxBuilder').get<PresentationTheme['id']>('theme') ?? 'cxNavy';
    return THEMES.find(theme => theme.id === configured) ?? THEMES[0];
}

async function selectTheme(): Promise<void> {
    const choice = await vscode.window.showQuickPick(
        THEMES.map(theme => ({ label: theme.label, description: `${theme.background} background with ${theme.accent} accent`, value: theme.id })),
        { title: 'PPTX Builder - Select Presentation Theme' }
    );
    if (!choice) { return; }
    await vscode.workspace.getConfiguration('pptxBuilder').update('theme', choice.value, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`PPTX Builder: ${choice.label} theme selected.`);
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
    const slides = expandSlides(parseMarkdownToSlides(editor.document.getText()));
    outputChannel.clear();
    outputChannel.appendLine(`PPTX Preview - ${slides.length} slides (${getTheme().label} theme):`);
    slides.forEach((s, i) => outputChannel.appendLine(`  Slide ${i + 1}: ${s.title}`));
    outputChannel.show();
}

export function deactivate(): void {
    outputChannel?.appendLine('[PPTX Builder] Deactivated.');
}
