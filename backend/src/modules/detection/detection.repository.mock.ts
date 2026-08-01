import { IDetectionRepository } from './detection.repository';
import { RawDetectionResult } from '../../core/providers/detection';

export class MockDetectionRepository implements IDetectionRepository {
  async saveDetection(result: RawDetectionResult): Promise<void> {
    console.log(`[MockDB] Saved detection for ${result.animalType} (${result.confidence * 100}%)`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
