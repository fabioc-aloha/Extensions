#!/usr/bin/env node
/**
 * SVG to PNG converter using @resvg/resvg-js (Rust-based, accurate rendering)
 * Usage: node scripts/svg-to-png.js <input.svg> <output.png> [width]
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const [,, inputSvg, outputPng, width] = process.argv;

if (!inputSvg || !outputPng) {
  console.error('Usage: node svg-to-png.js <input.svg> <output.png> [width]');
  process.exit(1);
}

const svgBuffer = fs.readFileSync(inputSvg);

const opts = {
  font: {
    loadSystemFonts: true,
  },
};

if (width) {
  opts.fitTo = { mode: 'width', value: parseInt(width, 10) };
}

const resvg = new Resvg(svgBuffer, opts);
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

fs.writeFileSync(outputPng, pngBuffer);
console.log(`✅ ${path.basename(inputSvg)} → ${path.basename(outputPng)} (${pngData.width}x${pngData.height})`);
