# Shared Utilities

Extracted from Alex Cognitive Architecture — reusable logic for the extension family.

| Module | Source | Description |
|---|---|---|
| `utils/decay.ts` | Alex Forgetting Curve (v5.9.6) | Usage-weighted knowledge decay with 4 profiles |
| `utils/secretScanner.ts` | Alex Secrets Management (v5.8.4) | Regex-based secret detection, 50+ patterns |
| `utils/fileObservations.ts` | Alex Background File Watcher (v5.9.8) | Hot files, stalled work, TODO hotspots |
| `api/replicate.ts` | Alex Replicate integration (ADR-007) | Image generation via Replicate API |
| `api/brandfetch.ts` | Alex Brandfetch client | Logo fetching via Brandfetch + Logo.dev |

## Usage

```typescript
import { DecayEngine, DecayProfile } from '../../shared/utils/decay';
import { SecretScanner } from '../../shared/utils/secretScanner';
import { FileObservationStore } from '../../shared/utils/fileObservations';
import { ReplicateClient } from '../../shared/api/replicate';
import { BrandfetchClient } from '../../shared/api/brandfetch';
```
