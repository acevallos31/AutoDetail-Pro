import knex, { Knex } from 'knex';
import { appConfig } from '@shared/config/env-schema';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('database');

let dbConnection: Knex;

/**
 * Initialize PostgreSQL connection using Knex
 * Portable between Supabase PostgreSQL and self-hosted PostgreSQL
 */
export async function initializeDatabase(): Promise<Knex> {
  if (dbConnection) {
    return dbConnection;
  }

  dbConnection = knex({
    client: 'pg',
    connection: {
      host: appConfig.dbHost || 'localhost',
      port: appConfig.dbPort,
      database: appConfig.dbName,
      user: appConfig.dbUser || 'postgres',
      password: appConfig.dbPassword || '',
      ssl: appConfig.dbSsl ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: appConfig.debug,
  });

  // Test connection
  try {
    await dbConnection.raw('SELECT 1');
    logger.info('✅ PostgreSQL connection successful', {
      host: appConfig.dbHost,
      database: appConfig.dbName,
    });
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed', error);
    throw error;
  }

  return dbConnection;
}

/**
 * Get the database connection instance
 */
export function getDatabase(): Knex {
  if (!dbConnection) {
    throw new Error('Database connection not initialized');
  }
  return dbConnection;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (dbConnection) {
    await dbConnection.destroy();
    logger.info('Database connection closed');
  }
}
