import 'dotenv/config';
import { appConfig } from '@shared/config/env-schema';
import { createLogger } from '@shared/utils/logger';
import { initializeDatabase } from '@infrastructure/database/postgresql/connection';
import { initializeSupabase, testSupabaseConnection } from '@infrastructure/database/supabase/client';

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

    // Initialize Supabase client
    logger.info('🔌 Initializing Supabase client...');
    initializeSupabase();
    logger.info('✅ Supabase client initialized');

    // Initialize database connection (PostgreSQL via Knex)
    logger.info('📦 Initializing PostgreSQL connection...');
    await initializeDatabase();
    logger.info('✅ PostgreSQL connected');

    // Test Supabase connection
    logger.info('🧪 Testing Supabase connection...');
    const supabaseOk = await testSupabaseConnection();
    if (!supabaseOk) {
      logger.warn('⚠️ Supabase connection test failed, but continuing...');
    }

    // Create Express app after database is initialized so route modules can safely access repositories.
    const { createApp } = await import('./app');
    const app = createApp();

    // Start server
    app.listen(appConfig.port, () => {
      logger.info(`✅ Server running on http://localhost:${appConfig.port}`);
      logger.info(`📚 API Version: ${appConfig.apiVersion}`);
      logger.info(`🔗 Frontend: ${appConfig.frontendUrl}`);
      logger.info('📊 Database Status:');
      logger.info(`   - PostgreSQL (Knex): ✅ Connected`);
      logger.info(`   - Supabase Client: ${supabaseOk ? '✅' : '⚠️'} ${supabaseOk ? 'Ready' : 'Failed'}`);
    });
  } catch (error) {
    logger.error('💥 Fatal error during bootstrap', error);
    process.exit(1);
  }
}

bootstrap();
