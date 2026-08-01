import { BaseService } from '../../core/services/BaseService';
import { IDetectionProvider } from '../../core/providers/detection';
import { IDetectionRepository } from './detection.repository';
import { DetectionResultDto } from './detection.types';
import { DetectionMapper } from './detection.mapper';
import { ApiError } from '../../core/utils/ApiError';
import { HTTP_STATUS } from '../../core/constants/http';

export class DetectionService extends BaseService {
  constructor(
    private readonly detectionProvider: IDetectionProvider,
    private readonly detectionRepository: IDetectionRepository
  ) {
    super();
  }

  async processImage(imageBuffer: Buffer): Promise<DetectionResultDto[]> {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid image buffer provided');
    }

    // 1. Send buffer to AI provider for inference
    const rawResults = await this.detectionProvider.analyze({ imageBuffer });

    // 2. Persist the raw results
    for (const result of rawResults) {
      await this.detectionRepository.saveDetection(result);
    }

    // 3. Map raw entities to DTOs
    return rawResults.map(raw => DetectionMapper.toDetectionResultDto(raw));
  }
}
