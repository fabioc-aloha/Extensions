/**
 * Brandfetch + Logo.dev API Client
 * Extracted from Alex Cognitive Architecture
 *
 * Fetches company logos by domain or name.
 * Falls back from Brandfetch (requires API key) to Logo.dev (free, no key).
 */

export interface LogoResult {
    url: string;
    format: 'svg' | 'png';
    source: 'brandfetch' | 'logo.dev';
    domain: string;
    companyName?: string;
}

export type InsertFormat = 'markdown' | 'svg-url' | 'png-url' | 'html-img';

export class BrandfetchClient {
    private apiKey?: string;
    private cache = new Map<string, LogoResult>();

    constructor(apiKey?: string) {
        this.apiKey = apiKey;
    }

    async fetchLogo(domainOrName: string): Promise<LogoResult | null> {
        const domain = this.normalizeDomain(domainOrName);
        const cacheKey = domain;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        // Try Brandfetch first if API key is available
        if (this.apiKey) {
            try {
                const result = await this.fetchFromBrandfetch(domain);
                if (result) {
                    this.cache.set(cacheKey, result);
                    return result;
                }
            } catch {
                // Fall through to Logo.dev
            }
        }

        // Fallback: Logo.dev (free, no API key required)
        const result = await this.fetchFromLogoDev(domain);
        if (result) {
            this.cache.set(cacheKey, result);
        }
        return result;
    }

    private async fetchFromBrandfetch(domain: string): Promise<LogoResult | null> {
        const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
            headers: { 'Authorization': `Bearer ${this.apiKey}` },
        });

        if (!response.ok) { return null; }

        const data = await response.json();
        const logos = data?.logos ?? [];
        const svgLogo = logos.find((l: any) => l.type === 'logo' && l.formats?.some((f: any) => f.format === 'svg'));

        if (svgLogo) {
            const format = svgLogo.formats.find((f: any) => f.format === 'svg');
            return { url: format.src, format: 'svg', source: 'brandfetch', domain, companyName: data.name };
        }

        const pngLogo = logos.find((l: any) => l.formats?.some((f: any) => f.format === 'png'));
        if (pngLogo) {
            const format = pngLogo.formats.find((f: any) => f.format === 'png');
            return { url: format.src, format: 'png', source: 'brandfetch', domain, companyName: data.name };
        }

        return null;
    }

    private async fetchFromLogoDev(domain: string): Promise<LogoResult | null> {
        // Logo.dev returns PNG logos at a stable URL, no API key needed
        const url = `https://img.logo.dev/${domain}?token=pk_free&format=png&size=128`;

        // Validate the URL is reachable
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok && response.headers.get('content-type')?.includes('image')) {
                return { url, format: 'png', source: 'logo.dev', domain };
            }
        } catch {
            return null;
        }
        return null;
    }

    static formatForInsert(logo: LogoResult, insertFormat: InsertFormat, altText?: string): string {
        const alt = altText ?? logo.companyName ?? logo.domain;
        switch (insertFormat) {
            case 'markdown':  return `![${alt}](${logo.url})`;
            case 'svg-url':   return logo.url;
            case 'png-url':   return logo.url;
            case 'html-img':  return `<img src="${logo.url}" alt="${alt}" width="128" />`;
        }
    }

    private normalizeDomain(input: string): string {
        // Strip protocol and path — keep just domain
        return input
            .replace(/^https?:\/\//i, '')
            .replace(/\/.*$/, '')
            .toLowerCase()
            .trim();
    }

    clearCache(): void {
        this.cache.clear();
    }
}
