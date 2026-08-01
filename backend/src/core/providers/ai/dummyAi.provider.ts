import { AiProvider, DetectionResult } from './ai.interface';

export class DummyAiProvider implements AiProvider {
  async detectAnimals(imagePath: string): Promise<DetectionResult[]> {
    console.log(`[DummyAI] Analyzing image: ${imagePath}`);
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Return dummy data
    return [
      {
        label: 'Wild Boar',
        confidence: 0.92,
        boundingBox: { x: 100, y: 150, width: 200, height: 180 },
      }
    ];
  }

  async healthCheck(): Promise<boolean> {
    return true; // Dummy provider is always healthy
  }
}
