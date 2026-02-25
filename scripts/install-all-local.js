/**
 * Build, package, and locally install all extensions.
 * Usage: node scripts/install-all-local.js
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const EXTS = [
  { name: 'ai-voice-reader',          build: 'bundle' },
  { name: 'brandfetch-logo-fetcher',  build: 'bundle' },
  { name: 'dev-wellbeing',            build: 'compile' },
  { name: 'focus-timer',              build: 'bundle' },
  { name: 'gamma-slide-assistant',    build: 'compile' },
  { name: 'hook-studio',              build: 'bundle' },
  { name: 'knowledge-decay-tracker',  build: 'bundle' },
  { name: 'markdown-to-word',         build: 'bundle' },
  { name: 'mcp-app-starter',          build: 'bundle' },
  { name: 'mermaid-diagram-pro',      build: 'compile' },
  { name: 'pptx-builder',             build: 'compile' },
  { name: 'replicate-image-studio',   build: 'compile' },
  { name: 'secret-guard',             build: 'bundle' },
  { name: 'svg-to-png',               build: 'compile' },
  { name: 'svg-toolkit',              build: 'compile' },
  { name: 'workspace-watchdog',       build: 'bundle' },
];

const results = { ok: [], failed: [] };

for (const ext of EXTS) {
  const dir = path.join(ROOT, 'extensions', ext.name);
  process.stdout.write(`\n[${ext.name}] Building (${ext.build})... `);

  // 1. Build
  const build = spawnSync('npm', ['run', ext.build], { cwd: dir, shell: true, encoding: 'utf-8' });
  if (build.status !== 0) {
    console.log('❌ BUILD FAILED');
    console.error(build.stderr?.slice(0, 400));
    results.failed.push({ name: ext.name, step: 'build', error: build.stderr?.slice(0, 200) });
    continue;
  }
  process.stdout.write('✅  Packaging... ');

  // 2. Remove old .vsix files
  const vsixFiles = fs.readdirSync(dir).filter(f => f.endsWith('.vsix'));
  vsixFiles.forEach(f => fs.unlinkSync(path.join(dir, f)));

  // 3. Package
  const pkg = spawnSync('npx', ['@vscode/vsce', 'package', '--no-dependencies'], { cwd: dir, shell: true, encoding: 'utf-8' });
  if (pkg.status !== 0) {
    console.log('❌ PACKAGE FAILED');
    console.error(pkg.stderr?.slice(0, 400));
    results.failed.push({ name: ext.name, step: 'package', error: pkg.stderr?.slice(0, 200) });
    continue;
  }

  // 4. Find the .vsix
  const vsix = fs.readdirSync(dir).find(f => f.endsWith('.vsix'));
  if (!vsix) {
    console.log('❌ No .vsix produced');
    results.failed.push({ name: ext.name, step: 'package', error: 'No .vsix found' });
    continue;
  }
  process.stdout.write('✅  Installing... ');

  // 5. Install
  const install = spawnSync('code', ['--install-extension', path.join(dir, vsix), '--force'], { shell: true, encoding: 'utf-8' });
  if (install.status !== 0) {
    console.log('❌ INSTALL FAILED');
    console.error(install.stderr?.slice(0, 400));
    results.failed.push({ name: ext.name, step: 'install', error: install.stderr?.slice(0, 200) });
    continue;
  }

  console.log(`✅  Installed ${vsix}`);
  results.ok.push(ext.name);
}

console.log('\n' + '─'.repeat(60));
console.log(`✅ Installed (${results.ok.length}): ${results.ok.join(', ')}`);
if (results.failed.length) {
  console.log(`❌ Failed   (${results.failed.length}):`);
  results.failed.forEach(f => console.log(`   ${f.name} [${f.step}]: ${f.error}`));
}
console.log('\nReload VS Code window (Ctrl+Shift+P → "Developer: Reload Window") to activate.');
