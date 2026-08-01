import { RawDetectionResult } from '../../core/providers/detection';
import { DetectionResultDto, RecommendationDto } from './detection.types';
import { AnimalType, RiskLevel } from '../../core/enums';

export class DetectionMapper {
  static toDetectionResultDto(raw: RawDetectionResult): DetectionResultDto {
    return {
      animal: raw.animalType,
      confidence: raw.confidence,
      boundingBox: raw.boundingBox,
      risk: raw.riskLevel,
      recommendations: this.generateRecommendations(raw.animalType, raw.riskLevel),
    };
  }

  private static generateRecommendations(animal: AnimalType, risk: RiskLevel): RecommendationDto[] {
    const recommendations: RecommendationDto[] = [];
    
    if (risk === RiskLevel.CRITICAL) {
      recommendations.push({ action: 'Trigger immediate siren deterrent', priority: 'High' });
    }

    if (animal === AnimalType.ELEPHANT) {
      recommendations.push({ action: 'Activate high-intensity strobe lights', priority: 'High' });
      recommendations.push({ action: 'Notify local wildlife authorities', priority: 'Medium' });
    } else if (animal === AnimalType.BOAR) {
      recommendations.push({ action: 'Activate ultrasonic repellents', priority: 'Medium' });
    }

    if (recommendations.length === 0) {
      recommendations.push({ action: 'Continue monitoring', priority: 'Low' });
    }

    return recommendations;
  }
}
