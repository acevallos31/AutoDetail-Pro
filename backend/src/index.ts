import 'dotenv/config';
import { appConfig } from '@shared/config/env-schema';
import { createLogger } from '@shared/utils/logger';
import { initializeDatabase } from '@infrastructure/database/postgresql/connection';
import { createApp } from './app';

const logger = createLogger('main');

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    logger.info('🚀 Starting AutoDetail Pro Backend', {
      environment: appConfig.nodeEnv,
      version: appConfig.apiVersion,
      port: appConfig.port,
    });

    // Initialize database connection
    logger.info('📦 Initializing database connection...');
    const db = await initializeDatabase();
    logger.info('✅ Database connected');

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(appConfig.port, () => {
      logger.info(`✅ Server running on http://localhost:${appConfig.port}`);
      logger.info(`📚 Docs: http://localhost:${appConfig.port}/api-docs`);
      logger.info(`🔗 Frontend: ${appConfig.frontendUrl}`);
    });
  } catch (error) {
    logger.error('💥 Fatal error during bootstrap', error);
    process.exit(1);
  }
}

bootstrap();
