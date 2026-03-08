import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('error-handler');

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message,
      ...(process.env.DEBUG && { details: error.stack }),
    },
  });
}
