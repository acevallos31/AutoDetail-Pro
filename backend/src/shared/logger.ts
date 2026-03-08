/**
 * Logger Utility
 * Winston-based logging with structured JSON output
 */

import { createLogger, format, transports, Logger } from 'winston';

const isDevelopment = process.env.NODE_ENV === 'development';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json()
);

const loggerInstance: Logger = createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'autodetail-pro' },
  transports: [
    // Console output
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    }),

    // Error log file
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
    }),

    // Combined log file
    new transports.File({
      filename: 'logs/combined.log',
      format: logFormat,
    }),
  ],
});

// Create log directory if needed
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs', { recursive: true });
}

export const logger = loggerInstance;

export default logger;
