/**
 * Replicate API Client
 * Extracted from Alex Cognitive Architecture (ADR-007)
 *
 * Handles image generation, upscaling, and video generation via Replicate API.
 * API key stored in VS Code SecretStorage — never in settings.json.
 */

export interface ReplicateInput {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    num_outputs?: number;
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

export type SupportedModel =
    | 'flux-schnell'        // Fast FLUX — best for quick iterations
    | 'flux-dev'            // FLUX Dev — higher quality
    | 'sdxl'                // Stable Diffusion XL
    | 'wan-2-1';            // Video generation (Wan 2.1)

const MODEL_VERSIONS: Record<SupportedModel, string> = {
    'flux-schnell': 'black-forest-labs/flux-schnell',
    'flux-dev': 'black-forest-labs/flux-dev',
    'sdxl': 'stability-ai/sdxl:39ed52f2319f9b3e26e6ebb2cc52c7f5c745bf0a46e1d6e12b63edb6c9fdc1e8',
    'wan-2-1': 'wavymulder/modelshark:wan-2-1',
};

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
