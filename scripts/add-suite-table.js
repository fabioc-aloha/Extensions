// add-suite-table.js
// Inserts a "CX Tools Suite" marketplace table into every extension README,
// just before the ## License section. Marks the current extension in the table.
// Safe to re-run — skips files that already have the section.

const fs = require('fs');
const path = require('path');

const EXTENSIONS_DIR = path.join(__dirname, '..', 'extensions');

const SUITE = [
  { dir: 'ai-voice-reader',        id: 'fabioc-aloha.ai-voice-reader',        name: 'AI Voice Reader',          desc: 'Read files, selections, or documents aloud with Web Speech API' },
  { dir: 'brandfetch-logo-fetcher', id: 'fabioc-aloha.brandfetch-logo-fetcher', name: 'Brandfetch Logo Fetcher',   desc: 'Fetch and insert brand logos from any domain — SVG, PNG, or Markdown' },
  { dir: 'dev-wellbeing',           id: 'fabioc-aloha.dev-wellbeing',           name: 'Dev Wellbeing',             desc: 'Posture, eye-strain, and hydration reminders for long coding sessions' },
  { dir: 'focus-timer',             id: 'fabioc-aloha.cx-focus-timer',          name: 'Focus Timer',               desc: 'Pomodoro-style focus and break timer with status bar countdown' },
  { dir: 'gamma-slide-assistant',   id: 'fabioc-aloha.gamma-slide-assistant',   name: 'Gamma Slide Assistant',     desc: 'Export Marp Markdown presentations to HTML and PDF' },
  { dir: 'hook-studio',             id: 'fabioc-aloha.hook-studio',             name: 'Hook Studio',               desc: 'Visual editor for VS Code hook conditions and automation rules' },
  { dir: 'knowledge-decay-tracker', id: 'fabioc-aloha.knowledge-decay-tracker', name: 'Knowledge Decay Tracker',  desc: 'Track staleness of documentation and flag overdue reviews' },
  { dir: 'markdown-to-word',        id: 'fabioc-aloha.cx-markdown-to-word',     name: 'Markdown to Word',          desc: 'Convert Markdown + Mermaid diagrams to .docx via Pandoc' },
  { dir: 'mcp-app-starter',         id: 'fabioc-aloha.mcp-app-starter',         name: 'MCP App Starter',           desc: 'Scaffold Model Context Protocol servers in TypeScript, JavaScript, or Python' },
  { dir: 'mermaid-diagram-pro',     id: 'fabioc-aloha.mermaid-diagram-pro',     name: 'Mermaid Diagram Pro',       desc: 'Preview, export, and validate Mermaid diagrams in Markdown files' },
  { dir: 'pptx-builder',            id: 'fabioc-aloha.pptx-builder',            name: 'PPTX Builder',              desc: 'Generate PowerPoint presentations from Markdown using pptxgenjs' },
  { dir: 'replicate-image-studio',  id: 'fabioc-aloha.replicate-image-studio',  name: 'Replicate Image Studio',    desc: 'Generate images and videos with FLUX, SDXL, and WAN via Replicate API' },
  { dir: 'secret-guard',            id: 'fabioc-aloha.cx-secret-guard',         name: 'SecretGuard',               desc: 'Scan workspaces and files for accidentally committed secrets and keys' },
  { dir: 'svg-to-png',              id: 'fabioc-aloha.svg-to-png',              name: 'SVG to PNG',                desc: 'Convert SVG files to PNG using resvg-js (Rust renderer, no ImageMagick)' },
  { dir: 'svg-toolkit',             id: 'fabioc-aloha.svg-toolkit',             name: 'SVG Toolkit',               desc: 'Preview, copy as data URI, and validate SVG files in-editor' },
  { dir: 'workspace-watchdog',      id: 'fabioc-aloha.cx-workspace-watchdog',   name: 'Workspace Watchdog',        desc: 'Monitor file health, detect stalled work, and surface hot files' },
];

const MARKETPLACE_BASE = 'https://marketplace.visualstudio.com/items?itemName=';

function buildTable(currentDir) {
  const rows = SUITE.map(ext => {
    const isCurrent = ext.dir === currentDir;
    const name = isCurrent ? `**${ext.name}** *(this)*` : ext.name;
    const link = `[Install ↗](${MARKETPLACE_BASE}${ext.id})`;
    return `| ${name} | ${ext.desc} | ${link} |`;
  });

  return [
    '---',
    '',
    '## 🔷 CX Tools Suite',
    '',
    'Explore more tools from the same suite:',
    '',
    '| Extension | Description | Marketplace |',
    '|-----------|-------------|-------------|',
    ...rows,
    '',
  ].join('\n');
}

const MARKER = '## 🔷 CX Tools Suite';
const LICENSE_HEADING = '## License';

let updated = 0, skipped = 0;

for (const ext of SUITE) {
  const readmePath = path.join(EXTENSIONS_DIR, ext.dir, 'README.md');
  if (!fs.existsSync(readmePath)) { console.log(`⚠️  Missing README: ${ext.dir}`); skipped++; continue; }

  let content = fs.readFileSync(readmePath, 'utf8');

  if (content.includes(MARKER)) {
    console.log(`⏭️  Already has table: ${ext.dir}`);
    skipped++;
    continue;
  }

  const licenseIdx = content.lastIndexOf('\n' + LICENSE_HEADING);
  if (licenseIdx === -1) {
    console.log(`⚠️  No License section: ${ext.dir}`);
    skipped++;
    continue;
  }

  const table = buildTable(ext.dir);
  content = content.slice(0, licenseIdx + 1) + table + '\n' + content.slice(licenseIdx + 1);
  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(`✅  ${ext.dir}`);
  updated++;
}

console.log(`\nUpdated: ${updated}  Skipped: ${skipped}`);
