#!/usr/bin/env node
/**
 * Clean build artifacts from all extensions.
 * Run from repo root: node scripts/clean-all.js
 */

import { readdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const EXTENSIONS_DIR = join(import.meta.dirname, '..', 'extensions');

const extensions = readdirSync(EXTENSIONS_DIR).filter(name =>
    existsSync(join(EXTENSIONS_DIR, name, 'package.json'))
);

console.log(`🧹 Cleaning ${extensions.length} extensions...\n`);

for (const ext of extensions) {
    const extDir = join(EXTENSIONS_DIR, ext);
    const targets = ['out', 'node_modules', '*.vsix'];

    // Remove out/ and *.vsix
    const outDir = join(extDir, 'out');
    if (existsSync(outDir)) {
        rmSync(outDir, { recursive: true, force: true });
        console.log(`  🗑️  ${ext}/out`);
    }

    // Remove *.vsix files
    try {
        const { readdirSync } = await import('fs');
        const vsixFiles = readdirSync(extDir).filter(f => f.endsWith('.vsix'));
        for (const vsix of vsixFiles) {
            rmSync(join(extDir, vsix));
            console.log(`  🗑️  ${ext}/${vsix}`);
        }
    } catch { /* skip */ }
}

console.log('\n✅ Clean complete.');
