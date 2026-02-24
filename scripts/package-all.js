#!/usr/bin/env node
/**
 * Package all extensions in parallel.
 * Run from repo root: node scripts/package-all.js
 * Options: --filter=hook-studio  (only package matching extensions)
 */

import { execSync, spawn } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const EXTENSIONS_DIR = join(import.meta.dirname, '..', 'extensions');
const filter = process.argv.find(a => a.startsWith('--filter='))?.split('=')[1];

const extensions = readdirSync(EXTENSIONS_DIR).filter(name => {
    if (filter && !name.includes(filter)) { return false; }
    const pkgPath = join(EXTENSIONS_DIR, name, 'package.json');
    return existsSync(pkgPath);
});

console.log(`📦 Packaging ${extensions.length} extension(s)${filter ? ` (filter: ${filter})` : ''}...\n`);

let succeeded = 0;
let failed = 0;
const errors = [];

for (const ext of extensions) {
    const extDir = join(EXTENSIONS_DIR, ext);
    try {
        console.log(`  Building ${ext}...`);
        execSync('npm run compile', { cwd: extDir, stdio: 'pipe' });
        execSync('npx @vscode/vsce package --no-dependencies', { cwd: extDir, stdio: 'pipe' });
        console.log(`  ✅ ${ext}`);
        succeeded++;
    } catch (err) {
        console.error(`  ❌ ${ext}: ${err.message}`);
        errors.push({ ext, error: err.message });
        failed++;
    }
}

console.log(`\nResults: ${succeeded} succeeded, ${failed} failed`);
if (errors.length > 0) {
    console.log('\nFailed extensions:');
    errors.forEach(e => console.log(`  - ${e.ext}: ${e.error.split('\n')[0]}`));
    process.exit(1);
}
