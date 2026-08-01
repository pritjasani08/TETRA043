import { IDetectionProvider, ProviderDetectionRequest, RawDetectionResult } from './IDetectionProvider';
import { AnimalType, RiskLevel } from '../../enums';

export class DummyDetectionProvider implements IDetectionProvider {
  async analyze(request: ProviderDetectionRequest): Promise<RawDetectionResult[]> {
    if (request.imageBuffer) {
      const text = request.imageBuffer.toString('utf-8');
      if (text.startsWith('FAIL')) {
        throw new Error('AI Provider internal failure');
      }
      if (text.startsWith('TIMEOUT')) {
        await new Promise((resolve) => setTimeout(resolve, 6000));
        throw new Error('AI Provider timeout');
      }
    }

    // Simulate AI inference delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        animalType: AnimalType.BOAR,
        confidence: 0.92,
        boundingBox: { x: 100, y: 150, width: 200, height: 180 },
        riskLevel: RiskLevel.HIGH,
      },
    ];
  }
}
