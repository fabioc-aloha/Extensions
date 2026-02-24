#!/usr/bin/env node
/**
 * Alex Extensions Architecture — SessionStop Hook
 * Runs when a VS Code agent session ends.
 *
 * Prompts to update goals.json if changes were made.
 */

'use strict';

const lines = [
    `[Alex Extensions SessionStop] Session ended: ${new Date().toISOString()}`,
    `If you completed a goal, update .github/config/goals.json (status: "active" → "done").`,
    `If you published an extension, tag the release: git tag "{extension}/v{version}"`,
];

process.stdout.write(lines.join('\n') + '\n');
