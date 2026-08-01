import { RawDetectionResult } from '../../core/providers/detection';

export interface IDetectionRepository {
  saveDetection(result: RawDetectionResult): Promise<void>;
}
