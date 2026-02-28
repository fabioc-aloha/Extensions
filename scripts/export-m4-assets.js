#!/usr/bin/env node
// M4.5 – apple-touch-icons  |  M4.6 – favicon PNGs  |  M4.7 – logo PNGs
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');

// ── Apple touch icon SVG generator (180×180) ─────────────────────────────────
function appleIconSvg(accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="32" fill="#0f172a"/>
  <!-- Rocket mark centred, scaled up -->
  <g transform="translate(90 90) scale(2.8) translate(-16 -16)">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="f" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffc857"/>
        <stop offset="100%" stop-color="#f97316"/>
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="20" rx="6" ry="9" fill="url(#g)"/>
    <polygon points="16,3 19,12 16,11 13,12" fill="url(#f)"/>
    <ellipse cx="10" cy="20" rx="2.5" ry="4" fill="url(#g)" opacity="0.8"/>
    <ellipse cx="22" cy="20" rx="2.5" ry="4" fill="url(#g)" opacity="0.8"/>
    <ellipse cx="16" cy="30" rx="3" ry="2" fill="${accent}" opacity="0.7"/>
  </g>
  <!-- Accent stripe bottom -->
  <rect x="0" y="170" width="180" height="10" fill="${accent}" opacity="0.55"/>
</svg>`;
}

function exportPng(svgStr, outPath, width) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: width } });
  fs.writeFileSync(outPath, resvg.render().asPng());
}

// ── M4.5: Apple touch icons ───────────────────────────────────────────────────
const appleTargets = [
  { svg: 'C:/Development/Alex_Plug_In/.github/assets/apple-touch-icon.svg',
    png: 'C:/Development/Alex_Plug_In/.github/assets/apple-touch-icon.png',     accent: '#6366f1' },
  { svg: 'C:/Development/Extensions/brand/logos/apple-touch-icon.svg',
    png: 'C:/Development/Extensions/brand/logos/apple-touch-icon.png',          accent: '#38bdf8' },
  { svg: 'C:/Development/Alex-Global-Knowledge/assets/apple-touch-icon.svg',
    png: 'C:/Development/Alex-Global-Knowledge/assets/apple-touch-icon.png',    accent: '#0d9488' },
];
for (const t of appleTargets) {
  const svg = appleIconSvg(t.accent);
  fs.writeFileSync(t.svg, svg);
  exportPng(svg, t.png, 180);
  console.log('✅ apple-touch-icon', t.accent, '→', t.png.split('/').pop());
}

// ── M4.6: Favicon PNGs (32×32) ───────────────────────────────────────────────
const faviconTargets = [
  { svg: 'C:/Development/Alex_Plug_In/platforms/vscode-extension/assets/favicon.svg',
    png: 'C:/Development/Alex_Plug_In/platforms/vscode-extension/assets/favicon.png' },
  { svg: 'C:/Development/Extensions/brand/logos/favicon.svg',
    png: 'C:/Development/Extensions/brand/logos/favicon.png' },
  { svg: 'C:/Development/AlexLearn/website/public/favicon.svg',
    png: 'C:/Development/AlexLearn/website/public/favicon.png' },
];
for (const f of faviconTargets) {
  if (!fs.existsSync(f.svg)) { console.log('  ⚠️  skip (not found):', f.svg); continue; }
  const svg = fs.readFileSync(f.svg, 'utf8');
  exportPng(svg, f.png, 32);
  console.log('✅ favicon.png →', f.png.split('/').slice(-4).join('/'));
}

// ── M4.7: logo.png at 128 / 256 / 512px ─────────────────────────────────────
const logoTargets = [
  { svg: 'C:/Development/Alex_Plug_In/platforms/vscode-extension/assets/logo.svg',
    dir: 'C:/Development/Alex_Plug_In/platforms/vscode-extension/assets', name: 'logo' },
  { svg: 'C:/Development/AlexLearn/logo.svg',
    dir: 'C:/Development/AlexLearn/assets/brand',                         name: 'logo' },
  { svg: 'C:/Development/Extensions/brand/logos/logo.svg',
    dir: 'C:/Development/Extensions/brand/logos',                         name: 'logo' },
  { svg: 'C:/Development/Alex-Global-Knowledge/assets/logo.svg',
    dir: 'C:/Development/Alex-Global-Knowledge/assets',                   name: 'logo' },
];
for (const l of logoTargets) {
  if (!fs.existsSync(l.svg)) { console.log('  ⚠️  skip (not found):', l.svg); continue; }
  const svg = fs.readFileSync(l.svg, 'utf8');
  for (const size of [128, 256, 512]) {
    const outPath = `${l.dir}/${l.name}-${size}.png`;
    exportPng(svg, outPath, size);
    console.log(`✅ ${l.name}-${size}.png →`, outPath.split('/').slice(-3).join('/'));
  }
}

console.log('\nM4.5–4.7 complete.');
