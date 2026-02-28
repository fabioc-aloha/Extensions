#!/usr/bin/env node
/**
 * batch-export-pngs.js
 * Exports all 16 icon.svg (128px) and 16 banner.svg (1200px) to PNG
 * Run from: C:\Development\Extensions
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const extensions = [
  'ai-voice-reader','brandfetch-logo-fetcher','dev-wellbeing','focus-timer',
  'gamma-slide-assistant','hook-studio','knowledge-decay-tracker','markdown-to-word',
  'mcp-app-starter','mermaid-diagram-pro','pptx-builder','replicate-image-studio',
  'secret-guard','svg-to-png','svg-toolkit','workspace-watchdog'
];

function exportSvg(svgPath, outPath, width) {
  if (!fs.existsSync(svgPath)) { console.warn(`  ⚠️  Not found: ${svgPath}`); return false; }
  const svgBuffer = fs.readFileSync(svgPath);
  const opts = { font: { loadSystemFonts: true }, fitTo: { mode: 'width', value: width } };
  const resvg = new Resvg(svgBuffer, opts);
  const data = resvg.render();
  fs.writeFileSync(outPath, data.asPng());
  return true;
}

let ok = 0, fail = 0;
for (const ext of extensions) {
  const dir = path.join('extensions', ext, 'assets');
  const iconOk  = exportSvg(path.join(dir, 'icon.svg'),   path.join(dir, 'icon.png'),   128);
  const bannerOk = exportSvg(path.join(dir, 'banner.svg'), path.join(dir, 'banner.png'), 1200);
  const status = (iconOk ? '🖼️ ' : '❌icon') + ' ' + (bannerOk ? '🏞️ ' : '❌banner');
  console.log(`${iconOk && bannerOk ? '✅' : '⚠️ '} ${ext.padEnd(30)} ${status}`);
  if (iconOk) ok++; else fail++;
  if (bannerOk) ok++; else fail++;
}
console.log(`\nDone: ${ok} exported, ${fail} failed`);
