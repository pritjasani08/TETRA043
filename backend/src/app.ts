import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './core/middleware/errorHandler';
import { notFoundHandler } from './core/middleware/notFoundHandler';
import { requestIdMiddleware } from './core/middleware/requestId';

// Module Routes
import healthRoutes from './modules/health/health.routes';
import { authRoutes } from './modules/auth';
import { dashboardRoutes } from './modules/dashboard';
import { detectionRoutes } from './modules/detection';
import { analyticsRoutes } from './modules/analytics';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);

// Register routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/detections', detectionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Catch-all for 404
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
