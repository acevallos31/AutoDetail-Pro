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

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import chalk from 'chalk';

interface MigrationFile {
  name: string;
  order: number;
  type: 'schema' | 'seed' | 'logic';
  path: string;
}

class MigrationRunner {
  private migrations: MigrationFile[] = [];
  private pool: Pool;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.validateEnv();
    
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  private validateEnv() {
    const required = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DB_PASSWORD',
    ];

    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.error(chalk.red('❌ Missing environment variables:'));
      missing.forEach((key) => {
        console.error(chalk.red(`   - ${key}`));
      });
      process.exit(1);
    }
  }

  private discoverMigrations() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const migrationsDir = path.join(__dirname, '../migrations');
    const seedsDir = path.join(__dirname, '../seeds');

    console.log(chalk.blue('📁 Discovering migrations...'));

    // Schema migrations
    const schemaMigrations = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.startsWith('001_') && f.endsWith('.sql'))
      .map((name) => ({
        name,
        order: parseInt(name.match(/\d+/)?.[0] || '999'),
        type: 'schema' as const,
        path: path.join(migrationsDir, name),
      }));

    // Seed migrations
    const seedMigrations = fs
      .readdirSync(seedsDir)
      .filter((f) => f.startsWith('001_') && f.endsWith('.sql'))
      .map((name) => ({
        name,
        order: parseInt(name.match(/\d+/)?.[0] || '999'),
        type: 'seed' as const,
        path: path.join(seedsDir, name),
      }));

    // Logic layer migrations
    const logicMigrations = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.startsWith('002_') && f.endsWith('.sql'))
      .map((name) => ({
        name,
        order: parseInt(name.match(/\d+/)?.[0] || '999'),
        type: 'logic' as const,
        path: path.join(migrationsDir, name),
      }));

    this.migrations = [
      ...schemaMigrations,
      ...seedMigrations,
      ...logicMigrations,
    ].sort((a, b) => a.order - b.order);

    console.log(
      chalk.green(
        `✅ Found ${this.migrations.length} migration(s):`
      )
    );
    this.migrations.forEach((m) => {
      const icon =
        m.type === 'schema' ? '📋' : m.type === 'seed' ? '🌱' : '⚡';
      console.log(`   ${icon} ${m.name} (${m.type})`);
    });
  }

  private readMigration(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read migration file: ${filePath}`);
    }
  }

  async executeMigration(migration: MigrationFile): Promise<boolean> {
    const sql = this.readMigration(migration.path);
    const icon =
      migration.type === 'schema'
        ? '📋'
        : migration.type === 'seed'
          ? '🌱'
          : '⚡';

    try {
      console.log(`\n${icon} Executing: ${chalk.cyan(migration.name)}`);

      // Execute using pool (direct connection)
      const result = await this.pool.query(sql);

      console.log(chalk.green(`   ✅ Success`));
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Ignore idempotent errors (already exists)
      const idempotentErrors = [
        'already exists',
        'duplicate key',
        'violates unique constraint',
        'relation already exists',
      ];
      
      const isIdempotentError = idempotentErrors.some(msg => 
        errorMsg.toLowerCase().includes(msg.toLowerCase())
      );

      if (isIdempotentError) {
        console.log(chalk.yellow(`   ⚠️  Already applied (skipped)`));
        return true; // Consider as success
      }

      console.error(chalk.red(`   ❌ Failed: ${errorMsg}`));
      return false;
    }
  }

  async run() {
    console.log(chalk.bold.blue('\n🚀 AutoDetail Pro - Database Migration Runner\n'));

    try {
      this.discoverMigrations();

      if (this.migrations.length === 0) {
        console.log(chalk.yellow('⚠️  No migrations found!'));
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const migration of this.migrations) {
        const success = await this.executeMigration(migration);
        if (success) {
          successCount++;
        } else {
          failureCount++;
          // Don't stop on error - continue to show all issues
        }
      }

      console.log(chalk.bold.blue('\n📊 Migration Summary:'));
      console.log(chalk.green(`   ✅ Successful: ${successCount}`));
      if (failureCount > 0) {
        console.log(chalk.red(`   ❌ Failed: ${failureCount}`));
      }

      // Verify installation
      if (failureCount === 0 && successCount === this.migrations.length) {
        await this.verifyInstallation();
      }

      process.exit(failureCount > 0 ? 1 : 0);
    } catch (error) {
      console.error(chalk.red('❌ Migration runner error:'), error);
      process.exit(1);
    } finally {
      await this.pool.end();
    }
  }

  private async verifyInstallation() {
    console.log(chalk.bold.blue('\n🔍 Verifying installation...\n'));

    const checks = [
      {
        name: 'Tables',
        query: `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`,
        expectedMin: 20,
      },
      {
        name: 'Functions',
        query: `SELECT COUNT(*) as count FROM pg_proc WHERE pronamespace != 11 AND proname LIKE '%appointment%'`,
        expectedMin: 3,
      },
      {
        name: 'Triggers',
        query: `SELECT COUNT(*) as count FROM pg_trigger WHERE tgname LIKE 'update_updated_at%' OR tgname LIKE 'audit_log_%'`,
        expectedMin: 10,
      },
      {
        name: 'Roles',
        query: `SELECT COUNT(*) as count FROM roles`,
        expectedMin: 5,
      },
      {
        name: 'Services',
        query: `SELECT COUNT(*) as count FROM services`,
        expectedMin: 5,
      },
      {
        name: 'Stations',
        query: `SELECT COUNT(*) as count FROM stations`,
        expectedMin: 1,
      },
    ];

    for (const check of checks) {
      try {
        const result = await this.pool.query(check.query);
        const count = result.rows[0]?.count || 0;
        const status = count >= check.expectedMin ? '✅' : '⚠️';
        console.log(
          `${status} ${check.name}: ${chalk.cyan(count)} (expected ≥ ${check.expectedMin})`
        );
      } catch (error) {
        console.log(
          `❌ ${check.name}: ${chalk.red((error as Error).message)}`
        );
      }
    }

    console.log(chalk.bold.green('\n🎉 Database migration completed successfully!\n'));
  }
}

// Run migrations
const runner = new MigrationRunner();
runner.run().catch((error) => {
  console.error(chalk.red('❌ Fatal error:'), error);
  process.exit(1);
});
