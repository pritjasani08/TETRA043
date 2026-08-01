export interface DetectionResult {
  boundingBox: { x: number; y: number; width: number; height: number };
  confidence: number;
  label: string;
}

export interface AiProvider {
  detectAnimals(imagePath: string): Promise<DetectionResult[]>;
  healthCheck(): Promise<boolean>;
}
