/**
 * Forgetting Curve Decay Engine
 * Extracted from Alex Cognitive Architecture v5.9.6
 *
 * Usage-weighted freshness scoring: referenceCount × 0.6 + recencyDecay × 0.4
 * Four decay profiles: aggressive (14d), moderate (60d), slow (180d), permanent
 */

export type DecayProfile = 'aggressive' | 'moderate' | 'slow' | 'permanent';
export type DecayTier = 'thriving' | 'active' | 'fading' | 'dormant';

const DECAY_HALF_LIVES_DAYS: Record<DecayProfile, number> = {
    aggressive: 14,
    moderate: 60,
    slow: 180,
    permanent: Infinity,
};

const TIER_THRESHOLDS = {
    thriving: 0.75,
    active: 0.5,
    fading: 0.25,
    dormant: 0,
};

export interface DecayEntry {
    id: string;
    lastAccessed: Date;
    referenceCount: number;
    profile: DecayProfile;
    tags?: string[];
}

export interface DecayScore {
    score: number;
    tier: DecayTier;
    daysSinceAccess: number;
    recencyDecay: number;
    usageWeight: number;
}

export class DecayEngine {
    /**
     * Compute the composite freshness score for an entry.
     * score = referenceCount_normalized × 0.6 + recencyDecay × 0.4
     */
    static score(entry: DecayEntry, maxReferenceCount = 100): DecayScore {
        const now = new Date();
        const daysSinceAccess = (now.getTime() - entry.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);

        const halfLife = DECAY_HALF_LIVES_DAYS[entry.profile];
        const recencyDecay = halfLife === Infinity
            ? 1.0
            : Math.pow(0.5, daysSinceAccess / halfLife);

        const usageWeight = Math.min(entry.referenceCount / maxReferenceCount, 1.0);
        const score = usageWeight * 0.6 + recencyDecay * 0.4;

        const tier = this.tier(score);
        return { score, tier, daysSinceAccess, recencyDecay, usageWeight };
    }

    static tier(score: number): DecayTier {
        if (score >= TIER_THRESHOLDS.thriving) { return 'thriving'; }
        if (score >= TIER_THRESHOLDS.active)   { return 'active'; }
        if (score >= TIER_THRESHOLDS.fading)   { return 'fading'; }
        return 'dormant';
    }

    /**
     * Parse a decay tag from a document comment or frontmatter.
     * Formats: "review: 90d", "review: 2026-05-15", "review: slow"
     */
    static parseTag(tag: string): { profile?: DecayProfile; reviewDate?: Date } | null {
        const reviewMatch = tag.match(/review:\s*(.+)/i);
        if (!reviewMatch) { return null; }

        const value = reviewMatch[1].trim();

        if (['aggressive', 'moderate', 'slow', 'permanent'].includes(value)) {
            return { profile: value as DecayProfile };
        }

        const daysMatch = value.match(/^(\d+)d$/);
        if (daysMatch) {
            const days = parseInt(daysMatch[1]);
            let profile: DecayProfile = 'slow';
            if (days <= 14) { profile = 'aggressive'; }
            else if (days <= 60) { profile = 'moderate'; }
            else if (days <= 180) { profile = 'slow'; }
            else { profile = 'permanent'; }
            return { profile };
        }

        const dateMatch = value.match(/^\d{4}-\d{2}-\d{2}$/);
        if (dateMatch) {
            return { reviewDate: new Date(value) };
        }

        return null;
    }

    /**
     * Filter entries by decay tier.
     */
    static filterByTier(entries: DecayEntry[], tier: DecayTier): DecayEntry[] {
        return entries.filter(e => this.score(e).tier === tier);
    }

    /**
     * Sort entries by score descending (highest freshness first).
     */
    static sortByFreshness(entries: DecayEntry[]): DecayEntry[] {
        return [...entries].sort((a, b) => this.score(b).score - this.score(a).score);
    }

    /**
     * Increment reference count (call this on every access).
     */
    static touch(entry: DecayEntry): DecayEntry {
        return {
            ...entry,
            lastAccessed: new Date(),
            referenceCount: entry.referenceCount + 1,
        };
    }
}
