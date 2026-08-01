import { MockDetectionRepository } from './detection.repository';
import { DetectionService } from './detection.service';
import { DetectionController } from './detection.controller';
import { createDetectionRoutes } from './detection.routes';
import { DummyDetectionProvider } from '../../core/providers/detection';

// Module Dependency Injection
const detectionProvider = new DummyDetectionProvider();
const detectionRepository = new MockDetectionRepository();

const detectionService = new DetectionService(detectionProvider, detectionRepository);
const detectionController = new DetectionController(detectionService);
const detectionRoutes = createDetectionRoutes(detectionController);

export { detectionRoutes };
