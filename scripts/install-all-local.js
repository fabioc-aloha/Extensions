#!/usr/bin/env node
/**
 * Package each extension through the canonical runner, then install its exact
 * manifest version into the local VS Code instance.
 */
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const EXTENSIONS_DIR = join(ROOT, 'extensions');
const PACKAGE_RUNNER = join(import.meta.dirname, 'package-all.js');
const results = { ok: [], failed: [] };

const installVsix = vsixPath => {
    const options = { stdio: 'inherit' };
    if (process.platform === 'win32') {
        execFileSync(
            'powershell',
            ['-NoProfile', '-NonInteractive', '-Command', "$ErrorActionPreference='Stop'; $code=(Get-Command code.cmd -ErrorAction Stop).Source; & $code '--install-extension' $env:VSIX_PATH '--force'; exit $LASTEXITCODE"],
            { ...options, env: { ...process.env, VSIX_PATH: vsixPath } }
        );
    } else {
        execFileSync('code', ['--install-extension', vsixPath, '--force'], options);
    }
};

for (const directory of readdirSync(EXTENSIONS_DIR)) {
    const extensionDir = join(EXTENSIONS_DIR, directory);
    const manifestPath = join(extensionDir, 'package.json');
    if (!existsSync(manifestPath)) { continue; }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const vsixPath = join(extensionDir, `${manifest.name}-${manifest.version}.vsix`);
    try {
        console.log(`\n[${directory}] Packaging...`);
        execFileSync(process.execPath, [PACKAGE_RUNNER, `--filter=${directory}`], { cwd: ROOT, stdio: 'inherit' });
        if (!existsSync(vsixPath)) {
            throw new Error(`Expected package was not created: ${vsixPath}`);
        }
        console.log(`[${directory}] Installing ${vsixPath}...`);
        installVsix(vsixPath);
        results.ok.push(directory);
    } catch (err) {
        results.failed.push({ directory, error: err instanceof Error ? err.message : String(err) });
    }
}

console.log(`\nInstalled (${results.ok.length}): ${results.ok.join(', ')}`);
if (results.failed.length) {
    console.error(`Failed (${results.failed.length}):`);
    results.failed.forEach(failure => console.error(`  ${failure.directory}: ${failure.error}`));
    process.exit(1);
}

console.log('Reload the VS Code window to activate the installed extensions.');
