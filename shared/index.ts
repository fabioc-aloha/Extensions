/**
 * @alex-extensions/shared
 * Barrel export for all shared utilities and API clients
 */

// Utils
export { DecayEngine, type DecayProfile, type DecayTier, type DecayEntry, type DecayScore } from './utils/decay';
export { SecretScanner, SECRET_PATTERNS, type SecretSeverity, type SecretPattern, type SecretFinding, type ScanOptions } from './utils/secretScanner';

// API Clients
export { ReplicateClient, MODEL_CATALOG, selectModelForPrompt, type ReplicateInput, type ReplicatePrediction, type SupportedModel, type ReplicateModelInfo } from './api/replicate';
export { BrandfetchClient, type LogoResult, type InsertFormat } from './api/brandfetch';
