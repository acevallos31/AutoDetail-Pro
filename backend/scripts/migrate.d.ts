#!/usr/bin/env tsx
/**
 * Database Migration Runner
 * Executes SQL migrations against Supabase
 *
 * Usage:
 *   npm run migrate           -- Run all pending migrations
 *   npm run migrate -- --reset -- Drop and recreate schema
 *   npm run migrate -- --skip-seeds -- Skip seed data
 *
 * Environment Variables Required:
 *   SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key for admin access
 *   DB_HOST - Database host
 *   DB_PORT - Database port (default: 5432)
 *   DB_NAME - Database name (default: postgres)
 *   DB_USER - Database user (default: postgres)
 *   DB_PASSWORD - Database password
 */
import 'dotenv/config';
//# sourceMappingURL=migrate.d.ts.map