/**
 * Updates the CX Tools submenu to use the brand logo SVG as icon.
 * Copies brand/logos/logo.svg into each extension's assets/ folder,
 * then updates the submenu definition to reference it.
 *
 * Run: node scripts/update-cx-submenu-icon.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOGO_SRC = path.join(ROOT, 'brand', 'logos', 'logo.svg');
const ICON_DEST_NAME = 'cx-icon.svg';

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

const logoSvg = fs.readFileSync(LOGO_SRC, 'utf-8');

let updated = 0;
for (const ext of EXTS) {
  const extDir = path.join(ROOT, 'extensions', ext);
  const assetsDir = path.join(extDir, 'assets');
  const iconDest = path.join(assetsDir, ICON_DEST_NAME);
  const pkgPath = path.join(extDir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    console.warn(`⚠️  Skipping ${ext} — package.json not found`);
    continue;
  }

  // Copy logo into extension assets
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  fs.writeFileSync(iconDest, logoSvg, 'utf-8');

  // Update package.json submenu definition
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (!pkg.contributes?.submenus?.length) {
    console.warn(`⚠️  ${ext} — no submenus found, skipping`);
    continue;
  }

  const submenu = pkg.contributes.submenus.find(s => s.id === 'cx.tools');
  if (!submenu) {
    console.warn(`⚠️  ${ext} — cx.tools submenu not found`);
    continue;
  }

  submenu.label = 'CX Tools';
  submenu.icon = {
    light: `assets/${ICON_DEST_NAME}`,
    dark: `assets/${ICON_DEST_NAME}`
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log(`✓ ${ext}`);
  updated++;
}

console.log(`\n✅ Updated ${updated}/${EXTS.length} extensions`);
console.log('Run node scripts/install-all-local.js to rebuild and reinstall.');
