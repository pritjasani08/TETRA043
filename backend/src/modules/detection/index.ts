import { SqlDetectionRepository } from './detection.repository.sql';
import { MockDetectionRepository } from './detection.repository.mock';
import { DetectionService } from './detection.service';
import { DetectionController } from './detection.controller';
import { createDetectionRoutes } from './detection.routes';
import { DummyDetectionProvider } from '../../core/providers/detection';
import { env } from '../../config/env';

// Module Dependency Injection
const detectionProvider = new DummyDetectionProvider();

const useMock = env.DATABASE_PROVIDER === 'mock';
const detectionRepository = useMock ? new MockDetectionRepository() : new SqlDetectionRepository();

const detectionService = new DetectionService(detectionProvider, detectionRepository);
const detectionController = new DetectionController(detectionService);
const detectionRoutes = createDetectionRoutes(detectionController);

export { detectionRoutes };
