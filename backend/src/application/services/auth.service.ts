// import { createClient } from '@supabase/supabase-js';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('auth');

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: { email: string; id?: string };
  accessToken: string;
  refreshToken: string;
}

// Supabase credentials - will be used in Phase 4 for real authentication
// const supabaseUrl = process.env.SUPABASE_URL || '';
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Supabase client will be used in Phase 4 for real authentication
// const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class AuthService {
  /**
   * Login with email and password
   * Demo: Uses hardcoded credentials until Supabase Auth is integrated
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    logger.info('Auth attempted', {
      email,
      service: 'AuthService',
      method: 'login',
    });

    // ========================================
    // PHASE 3: Demo/Placeholder Authentication
    // ========================================
    // TODO: Phase 4 - Replace with real Supabase Auth
    // Currently accepting demo credentials for testing
    if (email === 'demo@autodetail.com' && password === 'password123') {
      return {
        user: {
          email,
          id: 'demo-user-id',
        },
        accessToken: `jwt-access-token-${Date.now()}`,
        refreshToken: `jwt-refresh-token-${Date.now()}`,
      };
    }

    // ========================================
    // PHASE 4: Real Supabase Auth Integration
    // ========================================
    // This is where Phase 4 will implement:
    // 1. supabase.auth.signInWithPassword()
    // 2. JWT token extraction and validation
    // 3. User data retrieval from custom user table

    try {
      // Attempt to authenticate with Supabase
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      //
      // if (error) {
      //   logger.warn('Supabase auth failed', { error: error.message });
      //   throw new Error('Credenciales inválidas');
      // }
      //
      // if (!data.session) {
      //   throw new Error('No session returned from Supabase');
      // }
      //
      // Get user details from custom users table
      // const { data: userData, error: userError } = await supabase
      //   .from('users')
      //   .select('id, email, name, role')
      //   .eq('email', email)
      //   .single();
      //
      // if (userError) {
      //   logger.warn('User lookup failed', { error: userError.message });
      // }
      //
      // return {
      //   user: userData || { email },
      //   accessToken: data.session.access_token,
      //   refreshToken: data.session.refresh_token || '',
      // };
    } catch (error) {
      logger.error('Auth service error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      throw new Error('Error en la autenticación');
    }

    throw new Error('Credenciales inválidas');
  }

  /**
   * Refresh access token using refresh token
   * Phase 4: Will be implemented with real JWT refresh logic
   */
  async refreshToken(refreshToken: string) {
    logger.info('Token refresh attempted', {
      service: 'AuthService',
      method: 'refreshToken',
    });

    // TODO: Phase 4 - Implement real token refresh
    // For now, return the same token

    if (!refreshToken) {
      throw new Error('Refresh token no proporcionado');
    }

    return {
      accessToken: `jwt-access-token-refreshed-${Date.now()}`,
      refreshToken: `jwt-refresh-token-refreshed-${Date.now()}`,
    };
  }

  /**
   * Validate JWT token
   * Phase 4: Will decode and verify JWT signature
   */
  async validateToken(token: string) {
    logger.debug('Token validation', {
      service: 'AuthService',
      method: 'validateToken',
      tokenLength: token.length,
    });

    // TODO: Phase 4 - Implement real JWT validation
    // For now, accept any token starting with 'jwt-'

    if (!token || !token.startsWith('jwt-')) {
      throw new Error('Token inválido');
    }

    return {
      isValid: true,
      payload: {
        sub: 'demo-user-id',
        email: 'demo@autodetail.com',
        iat: Math.floor(Date.now() / 1000),
      },
    };
  }
}

export default new AuthService();
