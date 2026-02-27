/**
 * Replicate API Client
 * Extracted from Alex Cognitive Architecture (ADR-007)
 *
 * Handles image generation, upscaling, and video generation via Replicate API.
 * API key stored in VS Code SecretStorage — never in settings.json.
 *
 * All models use the model-based API (owner/name) — no hardcoded version hashes.
 * Model catalog mirrors Alex's replicateService.ts REPLICATE_MODELS catalog.
 */

export interface ReplicateInput {
    prompt: string;
    negative_prompt?: string;
    /** Aspect ratio string, e.g. "1:1", "16:9", "9:16", "4:3" */
    aspect_ratio?: string;
    /** Output image format */
    output_format?: 'png' | 'jpg' | 'webp';
    width?: number;
    height?: number;
    num_outputs?: number;
    num_inference_steps?: number;
    guidance_scale?: number;
    seed?: number;
}

export interface ReplicatePrediction {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    output?: string | string[];
    error?: string;
    urls: {
        get: string;
        cancel: string;
    };
}

export interface ReplicateModelInfo {
    /** Replicate model identifier in `owner/name` format */
    id: string;
    /** Human-readable display name */
    label: string;
    /** Approximate cost per image */
    cost: string;
    /** Primary use case */
    bestFor: string;
    /** Whether this model reliably renders text inside images */
    textRendering: boolean;
    /** Whether this is a video model */
    isVideo?: boolean;
}

export type SupportedModel =
    | 'flux-schnell'        // Fast FLUX — best for quick iterations (~$0.003)
    | 'flux-dev'            // FLUX Dev — higher quality, LoRA (~$0.025)
    | 'flux-pro'            // FLUX 1.1 Pro — production photorealistic (~$0.04)
    | 'sdxl'                // Stable Diffusion XL — classic, LoRA (~$0.009)
    | 'ideogram-turbo'      // Ideogram v2 Turbo — fast text-in-image (~$0.05)
    | 'ideogram'            // Ideogram v2 — best text rendering (~$0.08)
    | 'seedream'            // Seedream 5 Lite — 2K/3K high-res (varies)
    | 'wan-2-1';            // Video generation (Wan 2.1 T2V)

/** Model catalog — all use model-based API (no version hashes) */
export const MODEL_CATALOG: Record<SupportedModel, ReplicateModelInfo> = {
    'flux-schnell': {
        id: 'black-forest-labs/flux-schnell',
        label: 'Flux Schnell',
        cost: '$0.003',
        bestFor: 'Fast prototyping — ~4 steps',
        textRendering: false
    },
    'sdxl': {
        id: 'stability-ai/sdxl',
        label: 'SDXL',
        cost: '$0.009',
        bestFor: 'Classic diffusion, LoRA fine-tuning, artistic styles',
        textRendering: false
    },
    'flux-dev': {
        id: 'black-forest-labs/flux-dev',
        label: 'Flux Dev',
        cost: '$0.025',
        bestFor: 'High-quality generation, LoRA support',
        textRendering: false
    },
    'flux-pro': {
        id: 'black-forest-labs/flux-1.1-pro',
        label: 'Flux 1.1 Pro',
        cost: '$0.04',
        bestFor: 'Production-quality photorealistic images',
        textRendering: false
    },
    'ideogram-turbo': {
        id: 'ideogram-ai/ideogram-v2-turbo',
        label: 'Ideogram v2 Turbo',
        cost: '$0.05',
        bestFor: 'Fast text-in-image — logos, banners, typography',
        textRendering: true
    },
    'ideogram': {
        id: 'ideogram-ai/ideogram-v2',
        label: 'Ideogram v2',
        cost: '$0.08',
        bestFor: 'Best-in-class text rendering — signage, badges, typography',
        textRendering: true
    },
    'seedream': {
        id: 'bytedance/seedream-5-lite',
        label: 'Seedream 5 Lite',
        cost: 'varies',
        bestFor: 'High-resolution 2K/3K outputs with visual reasoning',
        textRendering: true
    },
    'wan-2-1': {
        id: 'wan-ai/wan2.1-t2v-480p',
        label: 'WAN 2.1',
        cost: 'varies',
        bestFor: 'Text-to-video generation',
        textRendering: false,
        isVideo: true
    }
};

/**
 * Ordered list for Quick Pick display (cheapest first).
 * @deprecated Use MODEL_CATALOG directly for model info.
 */
const MODEL_VERSIONS: Record<SupportedModel, string> = Object.fromEntries(
    Object.entries(MODEL_CATALOG).map(([k, v]) => [k, v.id])
) as Record<SupportedModel, string>;

/**
 * Select the best model for a given prompt based on intent signals.
 * Mirrors Alex's selectModelForPrompt logic from replicateService.ts.
 */
export function selectModelForPrompt(prompt: string, preferSpeed = false): SupportedModel {
    const lower = prompt.toLowerCase();

    // Text-in-image signals → Ideogram
    const textSignals = ['text', 'logo', 'banner', 'badge', 'sign', 'label', 'typography',
        'font', 'title', 'poster', 'card', 'inscription', 'overlay'];
    if (textSignals.some(kw => lower.includes(kw))) {
        return preferSpeed ? 'ideogram-turbo' : 'ideogram';
    }

    // Speed / prototyping
    if (['fast', 'quick', 'draft', 'prototype', 'test', 'iterate', 'cheap'].some(kw => lower.includes(kw))) {
        return 'flux-schnell';
    }

    // High resolution
    if (['2k', '3k', 'cinematic', 'high resolution', 'large'].some(kw => lower.includes(kw))) {
        return 'seedream';
    }

    // Production / professional
    if (['production', 'professional', 'photo', 'photorealistic'].some(kw => lower.includes(kw))) {
        return 'flux-pro';
    }

    // Artistic / LoRA
    if (['artistic', 'art style', 'lora', 'stable diffusion'].some(kw => lower.includes(kw))) {
        return 'sdxl';
    }

    // Default: Flux Dev — best balance of quality and cost
    return 'flux-dev';
}

export class ReplicateClient {
    private apiToken: string;
    private baseUrl = 'https://api.replicate.com/v1';

    constructor(apiToken: string) {
        this.apiToken = apiToken;
    }

    async createPrediction(model: SupportedModel, input: ReplicateInput): Promise<ReplicatePrediction> {
        const modelId = MODEL_VERSIONS[model];
        const response = await fetch(`${this.baseUrl}/models/${modelId}/predictions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input }),
        });

        if (!response.ok) {
            throw new Error(`Replicate API error ${response.status}: ${await response.text()}`);
        }

        return response.json() as Promise<ReplicatePrediction>;
    }

    async waitForPrediction(predictionId: string, timeoutMs = 120_000): Promise<ReplicatePrediction> {
        const start = Date.now();
        const pollIntervalMs = 1000;

        while (Date.now() - start < timeoutMs) {
            const response = await fetch(`${this.baseUrl}/predictions/${predictionId}`, {
                headers: { 'Authorization': `Bearer ${this.apiToken}` },
            });

            if (!response.ok) {
                throw new Error(`Replicate poll error ${response.status}`);
            }

            const prediction = await response.json() as ReplicatePrediction;

            if (prediction.status === 'succeeded') { return prediction; }
            if (prediction.status === 'failed')    { throw new Error(prediction.error ?? 'Prediction failed'); }
            if (prediction.status === 'canceled')  { throw new Error('Prediction was canceled'); }

            await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        }

        throw new Error(`Prediction timed out after ${timeoutMs}ms`);
    }

    async generate(model: SupportedModel, input: ReplicateInput): Promise<string[]> {
        const prediction = await this.createPrediction(model, input);
        const completed = await this.waitForPrediction(prediction.id);

        const output = completed.output;
        if (!output) { return []; }
        return Array.isArray(output) ? output : [output];
    }

    async cancelPrediction(predictionId: string): Promise<void> {
        await fetch(`${this.baseUrl}/predictions/${predictionId}/cancel`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.apiToken}` },
        });
    }
}
