import { IDetectionProvider, ProviderDetectionRequest, RawDetectionResult } from './IDetectionProvider';

export class FastApiDetectionProvider implements IDetectionProvider {
  async analyze(request: ProviderDetectionRequest): Promise<RawDetectionResult[]> {
    throw new Error('FastApiDetectionProvider is not implemented yet. (Reserved for Phase 12)');
  }
}
