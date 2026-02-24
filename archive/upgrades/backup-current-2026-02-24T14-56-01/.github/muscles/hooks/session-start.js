#!/usr/bin/env node
/**
 * Alex Extensions Architecture — SessionStart Hook
 * Runs when a VS Code agent session begins.
 *
 * Outputs cognitive context snapshot: active sprint, priority extension,
 * overdue goals, user greeting.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');

function readJson(filePath) {
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch { return null; }
}

// Load user profile
const profile = readJson(path.join(ghPath, 'config', 'user-profile.json'));
const userName = profile?.name?.split(' ')[0] || 'there';

// Load goals
const goalsData = readJson(path.join(ghPath, 'config', 'goals.json'));
const activeGoals = (goalsData?.goals || []).filter(g => g.status === 'active');
const topGoal = activeGoals[0]?.title || null;

// Load cognitive config
const cogConfig = readJson(path.join(ghPath, 'config', 'cognitive-config.json'));
const sprint = cogConfig?.architecture_specific?.sprint || 1;
const priorityExtensions = cogConfig?.architecture_specific?.priority_extensions || [];

// Check TODO.md for sprint status
let todoLine = null;
const todoPath = path.join(workspaceRoot, 'TODO.md');
try {
    const todoContent = fs.readFileSync(todoPath, 'utf8');
    const lines = todoContent.split('\n');
    const inProgress = lines.find(l => l.includes('- [ ]') || l.includes('- [x]'));
    todoLine = inProgress?.trim() || null;
} catch { /* no TODO.md */ }

// Output context
const lines = [
    `[Alex Extensions SessionStart] Hello, ${userName}.`,
    `Sprint ${sprint} | Priority: ${priorityExtensions.join(' → ')}`,
];

if (topGoal) {
    lines.push(`Active goal: "${topGoal}"`);
}

if (activeGoals.length > 1) {
    lines.push(`${activeGoals.length - 1} more active goal(s) in .github/config/goals.json`);
}

lines.push(`REMINDER: npm run compile after every file edit. npx vsce ls before every publish.`);
lines.push(`Session: ${new Date().toISOString()}`);

process.stdout.write(lines.join('\n') + '\n');
