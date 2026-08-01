import { RawDetectionResult } from '../../core/providers/detection';
import crypto from 'crypto';

export interface IDetectionRepository {
  saveDetection(result: RawDetectionResult): Promise<void>;
}

export class MockDetectionRepository implements IDetectionRepository {
  async saveDetection(result: RawDetectionResult): Promise<void> {
    // In the future, this maps RawDetectionResult into a SQL INSERT statement.
    // We are simulating persistence.
    console.log(`[MockDB] Saved detection for ${result.animalType} (${result.confidence * 100}%)`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
