#!/usr/bin/env node
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const EXTENSIONS_DIR = join(import.meta.dirname, '..', 'extensions');
const NAVY = '#0f172a';
const BORDER = '#24324a';
const MUTED = '#cbd5e1';

const icon = (accent, glyph) => `\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect x="10" y="10" width="108" height="108" rx="26" fill="${NAVY}"/>
  <rect x="10.75" y="10.75" width="106.5" height="106.5" rx="25.25" fill="none" stroke="${BORDER}" stroke-width="1.5"/>
  <rect x="43" y="104" width="42" height="3.5" rx="1.75" fill="${accent}" opacity=".8"/>
  <g fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
</svg>`;

const icons = [
    {
        name: 'ai-voice-reader',
        accent: '#8b5cf6',
        glyph: `
          <circle cx="43" cy="63" r="5" fill="#8b5cf6" stroke="none"/>
          <path d="M53 51c7 7 7 19 0 26" opacity=".65"/>
          <path d="M64 42c12 12 12 32 0 44" opacity=".8"/>
          <path d="M76 34c17 17 17 43 0 60"/>`
    },
    {
        name: 'brandfetch-logo-fetcher',
        accent: '#38bdf8',
        glyph: `
          <path d="M37 45v22l24 24 30-30-24-24z"/>
          <circle cx="52" cy="55" r="5" fill="#38bdf8" stroke="none"/>
          <path d="M72 43l8 8"/>`
    },
    {
        name: 'dev-wellbeing',
        accent: '#34d399',
        glyph: `
          <path d="M64 92V60"/>
          <path d="M64 69c-15-2-23-12-23-26 15 0 23 10 23 26z" fill="#34d399" stroke="none" opacity=".9"/>
          <path d="M64 61c3-15 13-23 27-23 0 15-10 23-27 23z" fill="#34d399" stroke="none" opacity=".65"/>
          <path d="M44 88h40" opacity=".75"/>`
    },
    {
        name: 'focus-timer',
        accent: '#fb923c',
        glyph: `
          <path d="M44 38h40M44 90h40"/>
          <path d="M48 38c0 17 32 19 32 27s-32 10-32 25"/>
          <path d="M80 38c0 17-32 19-32 27s32 10 32 25"/>`
    },
    {
        name: 'gamma-slide-assistant',
        accent: '#2dd4bf',
        glyph: `
          <rect x="34" y="38" width="60" height="42" rx="6"/>
          <path d="M47 91h34M64 80v11"/>
          <path d="M48 65l10-10 8 7 14-15" stroke="${MUTED}" stroke-width="4"/>`
    },
    {
        name: 'hook-studio',
        accent: '#818cf8',
        glyph: `
          <path d="M54 39c-9 0-11 6-11 12v8c0 5-3 8-8 8 5 0 8 3 8 8v4c0 6 2 12 11 12"/>
          <path d="M74 39c9 0 11 6 11 12v8c0 5 3 8 8 8-5 0-8 3-8 8v4c0 6-2 12-11 12"/>
          <circle cx="64" cy="67" r="5" fill="#818cf8" stroke="none"/>`
    },
    {
        name: 'knowledge-decay-tracker',
        accent: '#fbbf24',
        glyph: `
          <path d="M42 87V66M57 87V54M72 87V45"/>
          <path d="M82 48l8 8-8 8"/>
          <path d="M90 56H75" opacity=".75"/>
          <path d="M42 92h38" opacity=".55"/>`
    },
    {
        name: 'markdown-to-word',
        accent: '#2dd4bf',
        glyph: `
          <path d="M34 42h22v40H34zM72 42h22v40H72z"/>
          <path d="M40 53h10M40 61h10M78 53h10M78 61h10"/>
          <path d="M58 62h12M65 55l7 7-7 7"/>`
    },
    {
        name: 'mcp-app-starter',
        accent: '#a78bfa',
        glyph: `
          <path d="M53 39l-14 26h15l-4 24 39-37H73l4-13z" fill="#a78bfa" stroke="none"/>
          <path d="M37 94h54" opacity=".5"/>`
    },
    {
        name: 'mermaid-diagram-pro',
        accent: '#fb7185',
        glyph: `
          <circle cx="47" cy="47" r="8"/>
          <circle cx="81" cy="47" r="8"/>
          <circle cx="64" cy="82" r="8"/>
          <path d="M54 51l7 23M74 51l-7 23M55 47h18" opacity=".75"/>`
    },
    {
        name: 'pptx-builder',
        accent: '#5eead4',
        glyph: `
          <rect x="37" y="45" width="42" height="30" rx="5" opacity=".55"/>
          <rect x="49" y="36" width="42" height="30" rx="5" fill="${NAVY}"/>
          <path d="M58 47h24M58 55h14M58 63h20" stroke="${MUTED}" stroke-width="4"/>`
    },
    {
        name: 'replicate-image-studio',
        accent: '#f472b6',
        glyph: `
          <rect x="35" y="43" width="44" height="38" rx="6"/>
          <circle cx="48" cy="55" r="4" fill="#f472b6" stroke="none"/>
          <path d="M40 75l11-11 8 7 7-8 8 12"/>
          <path d="M89 38v14M82 45h14" stroke="${MUTED}" stroke-width="4"/>`
    },
    {
        name: 'secret-guard',
        accent: '#22d3ee',
        glyph: `
          <path d="M64 35l24 9v18c0 16-10 26-24 31-14-5-24-15-24-31V44z"/>
          <path d="M53 64l8 8 15-17" stroke="${MUTED}" stroke-width="5"/>`
    },
    {
        name: 'svg-to-png',
        accent: '#f97316',
        glyph: `
          <circle cx="48" cy="48" r="5" fill="#f97316" stroke="none"/>
          <circle cx="80" cy="48" r="5" fill="#f97316" stroke="none"/>
          <circle cx="48" cy="80" r="5" fill="#f97316" stroke="none"/>
          <circle cx="80" cy="80" r="5" fill="#f97316" stroke="none"/>
          <path d="M56 48h16M48 56v16M80 56v16"/>
          <path d="M66 68l8 8 15-18" stroke="${MUTED}" stroke-width="4"/>`
    },
    {
        name: 'svg-toolkit',
        accent: '#fb7185',
        glyph: `
          <path d="M41 80c0-25 45-20 45-42"/>
          <path d="M41 80l-10 9M86 38l10-9" opacity=".7"/>
          <rect x="35" y="74" width="12" height="12" rx="2"/>
          <rect x="80" y="32" width="12" height="12" rx="2"/>
          <circle cx="31" cy="89" r="4" fill="#fb7185" stroke="none"/>
          <circle cx="96" cy="29" r="4" fill="#fb7185" stroke="none"/>`
    },
    {
        name: 'workspace-watchdog',
        accent: '#818cf8',
        glyph: `
          <path d="M34 64s12-20 30-20 30 20 30 20-12 20-30 20-30-20-30-20z"/>
          <circle cx="64" cy="64" r="9"/>
          <circle cx="64" cy="64" r="3" fill="#818cf8" stroke="none"/>`
    }
];

for (const definition of icons) {
    const svg = icon(definition.accent, definition.glyph);
    const assetsDir = join(EXTENSIONS_DIR, definition.name, 'assets');
    writeFileSync(join(assetsDir, 'icon.svg'), `${svg.replace(/\n/g, '\r\n')}\r\n`);
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 128 } }).render().asPng();
    writeFileSync(join(assetsDir, 'icon.png'), png);
}

console.log(`Generated ${icons.length} icon SVG and PNG pairs.`);
