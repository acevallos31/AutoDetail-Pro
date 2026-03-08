import winston from 'winston';
import { appConfig } from '@shared/config/env-schema';

/**
 * Create a Winston logger instance
 * @param module - Module/component name for context
 */
export function createLogger(module: string) {
  return winston.createLogger({
    level: appConfig.logLevel,
    format: appConfig.logFormat === 'json'
      ? winston.format.json()
      : winston.format.simple(),
    defaultMeta: { module },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, module, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `[${timestamp}] ${level} [${module}] ${message} ${metaStr}`;
          })
        ),
      }),
      // File transport for production
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    ],
  });
}

export const logger = createLogger('global');
