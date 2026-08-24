#!/usr/bin/env node
/**
 * Package or publish all extensions through their manifest-defined scripts.
 * Run from repo root: node scripts/package-all.js
 * Options:
 *   --filter=hook-studio,mcp-app-starter  Select by directory or package name
 *   --publish                              Upload the generated VSIX files
 *   --azure-credential                     Authenticate publishing with Microsoft Entra ID
 *   --dry-run                              Print the selected actions without running them
 */
import { execFileSync } from 'child_process';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const EXTENSIONS_DIR = join(import.meta.dirname, '..', 'extensions');
const args = process.argv.slice(2);
const filter = args.find(arg => arg.startsWith('--filter='))?.slice('--filter='.length);
const selectedNames = filter?.split(',').map(name => name.trim()).filter(Boolean);
const publish = args.includes('--publish');
const azureCredential = args.includes('--azure-credential');
const dryRun = args.includes('--dry-run');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const extensions = readdirSync(EXTENSIONS_DIR).flatMap(directory => {
    const pkgPath = join(EXTENSIONS_DIR, directory, 'package.json');
    if (!existsSync(pkgPath)) {
        return [];
    }

    const manifest = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (selectedNames && !selectedNames.includes(directory) && !selectedNames.includes(manifest.name)) {
        return [];
    }

    return [{ directory, manifest }];
});

if (extensions.length === 0) {
    const available = readdirSync(EXTENSIONS_DIR)
        .filter(name => existsSync(join(EXTENSIONS_DIR, name, 'package.json')))
        .join(', ');
    throw new Error(`No extensions matched the filter. Available extensions: ${available}`);
}

if (azureCredential && !publish) {
    throw new Error('--azure-credential requires --publish.');
}

if (publish && !dryRun && !process.env.VSCE_PAT && !azureCredential) {
    throw new Error('Set VSCE_PAT or use --azure-credential before publishing. Use --dry-run to preview the selected release.');
}

const mode = publish ? 'Publishing' : 'Packaging';
console.log(`${mode} ${extensions.length} extension(s)${filter ? ` (filter: ${filter})` : ''}...\n`);

const run = (command, commandArgs, cwd) => {
    console.log(`  > ${command} ${commandArgs.join(' ')}`);
    if (!dryRun) {
        const options = { cwd, stdio: 'inherit' };
        if (process.platform === 'win32') {
            execFileSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command, ...commandArgs], options);
        } else {
            execFileSync(command, commandArgs, options);
        }
    }
};

const failures = [];
const packaged = [];

for (const { directory, manifest } of extensions) {
    const extDir = join(EXTENSIONS_DIR, directory);
    try {
        console.log(`${dryRun ? 'Would build' : 'Building'} ${directory}...`);
        run(npm, ['run', 'compile'], extDir);
        run(npm, ['run', 'package'], extDir);

        const vsixPath = join(extDir, `${manifest.name}-${manifest.version}.vsix`);
        if (!dryRun && !existsSync(vsixPath)) {
            throw new Error(`Expected package was not created: ${vsixPath}`);
        }

        packaged.push({ directory, vsixPath });
        console.log(`  ${dryRun ? 'Would package' : 'Packaged'} ${directory}`);
    } catch (err) {
        console.error(`  Failed ${directory}: ${err.message}`);
        failures.push({ directory, error: err.message });
    }
}

if (failures.length > 0) {
    console.error('\nNo extensions were published because packaging did not complete for every selected extension.');
    failures.forEach(({ directory, error }) => console.error(`  - ${directory}: ${error.split('\n')[0]}`));
    process.exit(1);
}

if (publish) {
    for (const { directory, vsixPath } of packaged) {
        try {
            console.log(`${dryRun ? 'Would publish' : 'Publishing'} ${directory}...`);
            const publishArgs = ['@vscode/vsce', 'publish', '--packagePath', vsixPath];
            if (azureCredential) {
                publishArgs.push('--azure-credential');
            }
            run(npx, publishArgs, EXTENSIONS_DIR);
            console.log(`  ${dryRun ? 'Would publish' : 'Published'} ${directory}`);
        } catch (err) {
            console.error(`  Failed ${directory}: ${err.message}`);
            failures.push({ directory, error: err.message });
        }
    }

    if (failures.length > 0) {
        console.error('\nSome extensions could not be published:');
        failures.forEach(({ directory, error }) => console.error(`  - ${directory}: ${error.split('\n')[0]}`));
        process.exit(1);
    }
}

console.log(`\n${dryRun ? 'Dry run complete' : 'Complete'}: ${packaged.length} extension(s) ${dryRun ? `would be ${publish ? 'published' : 'packaged'}` : (publish ? 'published' : 'packaged')}.`);
