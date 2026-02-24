#!/usr/bin/env node
/**
 * Alex Extensions Architecture — Pre-File-Write Hook
 *
 * Scans file content for hardcoded secrets before writing.
 * Blocks writes that contain API keys, tokens, or known credential patterns.
 *
 * Called by the beforeFileCreate hook in hooks.json.
 */

'use strict';

// Read file content from stdin (VS Code passes it via stdin for hook inspection)
let content = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { content += chunk; });
process.stdin.on('end', () => {
    const violations = scanForSecrets(content);
    if (violations.length > 0) {
        process.stderr.write(
            '[Alex SecretGuard] BLOCKED — potential secret detected:\n' +
            violations.map(v => `  Line ${v.line}: ${v.type}`).join('\n') + '\n' +
            'Use VS Code SecretStorage instead of hardcoding credentials.\n'
        );
        process.exit(1);  // non-zero exit blocks the file write
    }
    process.exit(0);      // allow
});

function scanForSecrets(text) {
    const patterns = [
        { re: /sk-[a-zA-Z0-9]{20,}/, type: 'OpenAI API key' },
        { re: /r8_[a-zA-Z0-9]{20,}/, type: 'Replicate API key' },
        { re: /AKIA[0-9A-Z]{16}/, type: 'AWS Access Key' },
        { re: /ghp_[a-zA-Z0-9]{36}/, type: 'GitHub PAT' },
        { re: /api[_-]?key\s*[=:]\s*['"][a-zA-Z0-9]{16,}['"]/, type: 'Generic API key assignment' },
    ];

    const violations = [];
    const lines = text.split('\n');

    lines.forEach((line, idx) => {
        // Skip comments and process.env references
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.includes('process.env')) {
            return;
        }

        patterns.forEach(({ re, type }) => {
            if (re.test(line)) {
                violations.push({ line: idx + 1, type });
            }
        });
    });

    return violations;
}
