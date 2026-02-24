/**
 * Background File Observation Store
 * Extracted from Alex Cognitive Architecture v5.9.8
 *
 * Tracks hot files, stalled work, and TODO hotspots across workspace sessions.
 * Persisted to .github/episodic/peripheral/file-observations.json
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FileObservation {
    path: string;
    openCount: number;
    lastOpened: string;     // ISO timestamp
    lastModified: string;   // ISO timestamp
    uncommittedSince?: string; // ISO timestamp — when uncommitted changes first detected
    todoCount: number;
    fixmeCount: number;
}

export interface ObservationStore {
    version: string;
    lastUpdated: string;
    files: Record<string, FileObservation>;
}

export interface HotFile {
    path: string;
    openCount: number;
    lastOpened: Date;
}

export interface StalledFile {
    path: string;
    uncommittedSince: Date;
    daysStalled: number;
    severity: 'warning' | 'alert' | 'critical';
}

export interface TodoHotspot {
    path: string;
    todoCount: number;
    fixmeCount: number;
    total: number;
}

const STALL_THRESHOLDS = { warning: 1, alert: 3, critical: 7 }; // days
const HOT_FILE_THRESHOLD = 5;      // opens in window
const HOT_FILE_WINDOW_DAYS = 7;
const STORE_VERSION = '1.0.0';

export class FileObservationStore {
    private storePath: string;
    private store: ObservationStore;

    constructor(workspaceRoot: string) {
        this.storePath = path.join(
            workspaceRoot, '.github', 'episodic', 'peripheral', 'file-observations.json'
        );
        this.store = this.load();
    }

    private load(): ObservationStore {
        try {
            if (fs.existsSync(this.storePath)) {
                return JSON.parse(fs.readFileSync(this.storePath, 'utf-8'));
            }
        } catch {
            // corrupt store — start fresh
        }
        return { version: STORE_VERSION, lastUpdated: new Date().toISOString(), files: {} };
    }

    async save(): Promise<void> {
        this.store.lastUpdated = new Date().toISOString();
        const dir = path.dirname(this.storePath);
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(this.storePath, JSON.stringify(this.store, null, 2), 'utf-8');
    }

    recordOpen(filePath: string): void {
        const rel = this.relativePath(filePath);
        const existing = this.store.files[rel];
        this.store.files[rel] = {
            path: rel,
            openCount: (existing?.openCount ?? 0) + 1,
            lastOpened: new Date().toISOString(),
            lastModified: existing?.lastModified ?? new Date().toISOString(),
            uncommittedSince: existing?.uncommittedSince,
            todoCount: existing?.todoCount ?? 0,
            fixmeCount: existing?.fixmeCount ?? 0,
        };
    }

    recordUncommitted(filePath: string, sinceDateIso: string): void {
        const rel = this.relativePath(filePath);
        if (this.store.files[rel]) {
            this.store.files[rel].uncommittedSince ??= sinceDateIso;
        }
    }

    clearUncommitted(filePath: string): void {
        const rel = this.relativePath(filePath);
        if (this.store.files[rel]) {
            delete this.store.files[rel].uncommittedSince;
        }
    }

    updateTodoCounts(filePath: string, todoCount: number, fixmeCount: number): void {
        const rel = this.relativePath(filePath);
        if (this.store.files[rel]) {
            this.store.files[rel].todoCount = todoCount;
            this.store.files[rel].fixmeCount = fixmeCount;
        }
    }

    getHotFiles(): HotFile[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - HOT_FILE_WINDOW_DAYS);

        return Object.values(this.store.files)
            .filter(f => {
                const lastOpened = new Date(f.lastOpened);
                return f.openCount >= HOT_FILE_THRESHOLD && lastOpened >= cutoff;
            })
            .map(f => ({ path: f.path, openCount: f.openCount, lastOpened: new Date(f.lastOpened) }))
            .sort((a, b) => b.openCount - a.openCount);
    }

    getStalledFiles(): StalledFile[] {
        const now = new Date();
        return Object.values(this.store.files)
            .filter(f => f.uncommittedSince)
            .map(f => {
                const since = new Date(f.uncommittedSince!);
                const daysStalled = (now.getTime() - since.getTime()) / (1000 * 60 * 60 * 24);
                const severity: StalledFile['severity'] =
                    daysStalled >= STALL_THRESHOLDS.critical ? 'critical' :
                    daysStalled >= STALL_THRESHOLDS.alert    ? 'alert'    : 'warning';
                return { path: f.path, uncommittedSince: since, daysStalled, severity };
            })
            .sort((a, b) => b.daysStalled - a.daysStalled);
    }

    getTodoHotspots(minTotal = 3): TodoHotspot[] {
        return Object.values(this.store.files)
            .map(f => ({ path: f.path, todoCount: f.todoCount, fixmeCount: f.fixmeCount, total: f.todoCount + f.fixmeCount }))
            .filter(h => h.total >= minTotal)
            .sort((a, b) => b.total - a.total);
    }

    getHealthTier(): 'green' | 'yellow' | 'red' {
        const stalled = this.getStalledFiles();
        const criticalStalled = stalled.filter(s => s.severity === 'critical').length;
        if (criticalStalled > 0) { return 'red'; }
        if (stalled.length > 3) { return 'yellow'; }
        return 'green';
    }

    private relativePath(filePath: string): string {
        // Normalize to forward slashes for cross-platform consistency
        return filePath.replace(/\\/g, '/');
    }
}
