#!/usr/bin/env node
/**
 * Stage resvg's cross-platform WASM package beneath out/ so VS Code can
 * resolve the renderer without a platform-specific native VSIX.
 */
import { execFileSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';

const REPO_ROOT = join(import.meta.dirname, '..');
const EXTENSION_DIR = join(REPO_ROOT, 'extensions', 'svg-to-png');
const ROOT_NODE_MODULES = join(REPO_ROOT, 'node_modules');
const STAGED_NODE_MODULES = join(EXTENSION_DIR, 'out', 'node_modules');

if (existsSync(STAGED_NODE_MODULES)) {
    throw new Error(`Refusing to overwrite existing runtime dependencies: ${STAGED_NODE_MODULES}`);
}

const copyPackage = packageName => {
    const packagePath = packageName.split('/');
    const source = join(ROOT_NODE_MODULES, ...packagePath);
    const destination = join(STAGED_NODE_MODULES, ...packagePath);

    if (!existsSync(source)) {
        throw new Error(`Runtime dependency is missing from the workspace install: ${packageName}`);
    }

    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true });
};

try {
    copyPackage('@resvg/resvg-wasm');

    const options = { cwd: EXTENSION_DIR, stdio: 'inherit' };
    if (process.platform === 'win32') {
        execFileSync(
            process.env.ComSpec ?? 'cmd.exe',
            ['/d', '/s', '/c', 'npx.cmd', '@vscode/vsce', 'package', '--no-dependencies'],
            options
        );
    } else {
        execFileSync('npx', ['@vscode/vsce', 'package', '--no-dependencies'], options);
    }
} finally {
    rmSync(STAGED_NODE_MODULES, { recursive: true, force: true });
}
