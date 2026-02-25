/**
 * Groups all CX extension context menu items under a single "CX Tools" submenu.
 * Run once: node scripts/add-cx-submenu.js
 */
const fs = require('fs');
const path = require('path');

const SUBMENU_ID = 'cx.tools';
const SUBMENU_DEF = {
  id: SUBMENU_ID,
  label: '$(tools) CX Tools',
  icon: '$(tools)'
};

const EXTS = [
  'ai-voice-reader',
  'brandfetch-logo-fetcher',
  'gamma-slide-assistant',
  'hook-studio',
  'knowledge-decay-tracker',
  'markdown-to-word',
  'mcp-app-starter',
  'mermaid-diagram-pro',
  'pptx-builder',
  'replicate-image-studio',
  'secret-guard',
  'svg-to-png',
  'svg-toolkit',
  'workspace-watchdog'
];

for (const e of EXTS) {
  const pkgPath = path.join('extensions', e, 'package.json');
  const raw = fs.readFileSync(pkgPath, 'utf-8');
  const pkg = JSON.parse(raw);

  const menus = pkg.contributes.menus || {};
  const editorItems = menus['editor/context'] || [];
  const explorerItems = menus['explorer/context'] || [];
  const hasExplorer = explorerItems.length > 0;

  // Deduplicate: editor items first, then explorer-only items
  const seen = new Set();
  const cxTools = [];
  for (const item of [...editorItems, ...explorerItems]) {
    if (!seen.has(item.command)) {
      seen.add(item.command);
      cxTools.push(item);
    }
  }

  // Build new menus object — submenu pointer only in top-level contexts
  const newMenus = {
    'editor/context': [{ submenu: SUBMENU_ID, group: 'navigation@99' }]
  };
  if (hasExplorer) {
    newMenus['explorer/context'] = [{ submenu: SUBMENU_ID, group: 'navigation@99' }];
  }
  // Preserve any other menu keys (e.g. commandPalette)
  for (const key of Object.keys(menus)) {
    if (key !== 'editor/context' && key !== 'explorer/context') {
      newMenus[key] = menus[key];
    }
  }
  newMenus[SUBMENU_ID] = cxTools;

  pkg.contributes.submenus = [SUBMENU_DEF];
  pkg.contributes.menus = newMenus;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log(`✓ ${e} — ${cxTools.length} commands in cx.tools`);
}
