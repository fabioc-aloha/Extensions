/**
 * Secret Scanner
 * Extracted from Alex Cognitive Architecture v5.8.4
 *
 * Regex-based secret detection with severity tiers.
 * Works on any string — file content, clipboard, git diffs.
 */

export type SecretSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface SecretPattern {
    id: string;
    name: string;
    pattern: RegExp;
    severity: SecretSeverity;
    description: string;
}

export interface SecretFinding {
    patternId: string;
    patternName: string;
    severity: SecretSeverity;
    line: number;
    column: number;
    match: string;
    context: string;     // surrounding text (redacted)
    filePath?: string;
}

export const SECRET_PATTERNS: SecretPattern[] = [
    // Critical — private keys
    { id: 'rsa-private-key', name: 'RSA Private Key', severity: 'critical',
      pattern: /-----BEGIN RSA PRIVATE KEY-----/,
      description: 'RSA private key header detected' },
    { id: 'private-key', name: 'Private Key', severity: 'critical',
      pattern: /-----BEGIN PRIVATE KEY-----/,
      description: 'Generic private key header detected' },
    { id: 'pgp-private-key', name: 'PGP Private Key', severity: 'critical',
      pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/,
      description: 'PGP private key detected' },

    // High — API tokens and keys
    { id: 'openai-key', name: 'OpenAI API Key', severity: 'high',
      pattern: /sk-[a-zA-Z0-9]{48}/,
      description: 'OpenAI API key (sk-...)' },
    { id: 'replicate-key', name: 'Replicate API Token', severity: 'high',
      pattern: /r8_[a-zA-Z0-9]{40}/,
      description: 'Replicate API token (r8_...)' },
    { id: 'github-pat', name: 'GitHub Personal Access Token', severity: 'high',
      pattern: /ghp_[a-zA-Z0-9]{36}/,
      description: 'GitHub PAT (ghp_...)' },
    { id: 'github-oauth', name: 'GitHub OAuth Token', severity: 'high',
      pattern: /gho_[a-zA-Z0-9]{36}/,
      description: 'GitHub OAuth token (gho_...)' },
    { id: 'azure-key', name: 'Azure API Key', severity: 'high',
      pattern: /(?i)azure.*['"=:\s][a-zA-Z0-9/+]{32,}/,
      description: 'Potential Azure API key or connection string' },
    { id: 'aws-access-key', name: 'AWS Access Key ID', severity: 'high',
      pattern: /AKIA[0-9A-Z]{16}/,
      description: 'AWS Access Key ID (AKIA...)' },

    // Medium — passwords and credentials
    { id: 'generic-password', name: 'Generic Password', severity: 'medium',
      pattern: /(?i)password\s*[=:]\s*['"][^'"]{8,}['"]/,
      description: 'Potential hardcoded password assignment' },
    { id: 'generic-secret', name: 'Generic Secret', severity: 'medium',
      pattern: /(?i)secret\s*[=:]\s*['"][^'"]{8,}['"]/,
      description: 'Potential hardcoded secret assignment' },
    { id: 'connection-string', name: 'Connection String', severity: 'medium',
      pattern: /(?i)(connection[-_]?string|mongodb\+srv:\/\/|postgres:\/\/|mysql:\/\/)[^\s'"]{10,}/,
      description: 'Database connection string detected' },

    // Low — potentially sensitive URLs
    { id: 'url-credentials', name: 'URL with Credentials', severity: 'low',
      pattern: /https?:\/\/[^:@\s]+:[^:@\s]+@/,
      description: 'URL containing username:password credentials' },
];

export interface ScanOptions {
    patterns?: SecretPattern[];
    ignorePatterns?: RegExp[];
    maxMatchLength?: number;
}

export class SecretScanner {
    private patterns: SecretPattern[];
    private ignorePatterns: RegExp[];

    constructor(options: ScanOptions = {}) {
        this.patterns = options.patterns ?? SECRET_PATTERNS;
        this.ignorePatterns = options.ignorePatterns ?? [
            /^\s*#/,           // comment lines
            /example|sample|placeholder|your[-_]?key/i,
        ];
        this.maxMatchLength = options.maxMatchLength ?? 80;
    }

    private maxMatchLength: number;

    scan(content: string, filePath?: string): SecretFinding[] {
        const findings: SecretFinding[] = [];
        const lines = content.split('\n');

        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];

            // Skip lines that match ignore patterns
            if (this.ignorePatterns.some(ig => ig.test(line))) {
                continue;
            }

            for (const pattern of this.patterns) {
                const match = line.match(pattern.pattern);
                if (match && match.index !== undefined) {
                    const rawMatch = match[0];
                    const redacted = rawMatch.length > 8
                        ? rawMatch.substring(0, 4) + '****' + rawMatch.substring(rawMatch.length - 2)
                        : '****';

                    findings.push({
                        patternId: pattern.id,
                        patternName: pattern.name,
                        severity: pattern.severity,
                        line: lineIdx + 1,
                        column: match.index + 1,
                        match: redacted,
                        context: line.substring(
                            Math.max(0, match.index - 20),
                            Math.min(line.length, match.index + this.maxMatchLength)
                        ).replace(rawMatch, redacted),
                        filePath,
                    });
                }
            }
        }

        return findings;
    }

    static groupBySeverity(findings: SecretFinding[]): Record<SecretSeverity, SecretFinding[]> {
        return {
            critical: findings.filter(f => f.severity === 'critical'),
            high: findings.filter(f => f.severity === 'high'),
            medium: findings.filter(f => f.severity === 'medium'),
            low: findings.filter(f => f.severity === 'low'),
        };
    }

    static toAuditReport(findings: SecretFinding[]): string {
        const grouped = SecretScanner.groupBySeverity(findings);
        const total = findings.length;

        if (total === 0) {
            return JSON.stringify({ status: 'clean', findings: [] }, null, 2);
        }

        return JSON.stringify({
            status: 'violations_found',
            summary: {
                total,
                critical: grouped.critical.length,
                high: grouped.high.length,
                medium: grouped.medium.length,
                low: grouped.low.length,
            },
            findings: findings.map(f => ({
                severity: f.severity,
                pattern: f.patternName,
                file: f.filePath ?? 'unknown',
                line: f.line,
                column: f.column,
                context: f.context,
            })),
        }, null, 2);
    }
}
