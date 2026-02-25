// fix-cx-submenu-icon.js
// Fixes CX Tools submenu: removes unsupported SVG icon object,
// adds emoji directly in label (the only approach VS Code renders in submenus).

const fs = require('fs');
const path = require('path');

const EXTENSIONS_DIR = path.join(__dirname, '..', 'extensions');
const EMOJI_LABEL = '🔷 CX Tools';

const dirs = fs.readdirSync(EXTENSIONS_DIR).filter(d =>
    fs.existsSync(path.join(EXTENSIONS_DIR, d, 'package.json'))
);

let updated = 0, skipped = 0;

for (const dir of dirs) {
    const pkgPath = path.join(EXTENSIONS_DIR, dir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const submenus = pkg.contributes?.submenus;
    if (!submenus) { skipped++; continue; }

    const cx = submenus.find(s => s.id === 'cx.tools');
    if (!cx) { skipped++; continue; }

    cx.label = EMOJI_LABEL;
    delete cx.icon;   // custom SVG icons are not supported on submenus

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log(`✅  ${dir}`);
    updated++;
}

console.log(`\nUpdated: ${updated}  Skipped: ${skipped}`);
