import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from '@shared/config/env-schema';
import { errorHandler } from '@presentation/middleware/error-handler.middleware';
import { requestLogger } from '@presentation/middleware/request-logger.middleware';
import { v1Routes } from '@presentation/routes/v1';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('app');

/**
 * Create and configure Express application
 */
export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: appConfig.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Logging
  app.use(requestLogger);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: appConfig.apiVersion,
    });
  });

  // API Routes
  app.use(`/api/${appConfig.apiVersion}`, v1Routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
      },
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  logger.info('✅ Express app configured');
  return app;
}
