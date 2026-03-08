import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '@shared/config/env-schema';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('supabase');

let supabaseClient: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 * Uses service role key for backend operations (bypasses RLS)
 */
export function initializeSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = appConfig.supabaseUrl;
  const supabaseServiceKey = appConfig.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseServiceKey) {
    logger.error('Missing Supabase credentials in environment');
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  logger.info('✅ Supabase client initialized', {
    url: supabaseUrl,
  });

  return supabaseClient;
}

/**
 * Get Supabase client instance
 * Must call initializeSupabase() first
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Call initializeSupabase() first.');
  }
  return supabaseClient;
}

/**
 * Create Supabase client with anon key (for public operations)
 * Used for operations that respect Row Level Security
 */
export function createAnonSupabaseClient(): SupabaseClient {
  const supabaseUrl = appConfig.supabaseUrl;
  const supabaseAnonKey = appConfig.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error('Missing Supabase anon credentials in environment');
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    
    // Test query - get a single role
    const { data, error } = await client
      .from('roles')
      .select('id, name')
      .limit(1);

    if (error) {
      logger.error('❌ Supabase connection test failed', { error: error.message });
      return false;
    }

    logger.info('✅ Supabase connection test successful', {
      rolesFound: data?.length || 0,
    });
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection test failed', error);
    return false;
  }
}

export default {
  initializeSupabase,
  getSupabaseClient,
  createAnonSupabaseClient,
  testSupabaseConnection,
};
