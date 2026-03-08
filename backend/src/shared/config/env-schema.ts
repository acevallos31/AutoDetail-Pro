import { z } from 'zod';

/**
 * Environment variables schema validation
 * Ensures all required config is present and correctly typed at startup
 */
export const envSchema = z.object({
  // App Config
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().default(3000),
  apiVersion: z.string().default('v1'),
  apiBaseUrl: z.string().url(),
  frontendUrl: z.string().url(),
  
  // Supabase (Initial Phase)
  supabaseUrl: z.string().url().optional(),
  supabaseAnonKey: z.string().optional(),
  supabaseServiceRoleKey: z.string().optional(),
  
  // Database (Direct PostgreSQL)
  dbHost: z.string().optional(),
  dbPort: z.coerce.number().default(5432),
  dbName: z.string().default('postgres'),
  dbUser: z.string().optional(),
  dbPassword: z.string().optional(),
  dbSsl: z.coerce.boolean().default(true),
  
  // Auth
  authType: z.enum(['supabase', 'passport']).default('supabase'),
  jwtSecret: z.string().optional(),
  jwtExpiry: z.string().default('24h'),
  jwtRefreshExpiry: z.string().default('7d'),
  
  // Storage
  storageType: z.enum(['supabase', 's3', 'local']).default('supabase'),
  s3Bucket: z.string().optional(),
  s3Region: z.string().optional(),
  s3AccessKeyId: z.string().optional(),
  s3SecretAccessKey: z.string().optional(),
  
  // Notifications
  notificationsType: z.enum(['supabase', 'socket.io', 'kafka']).default('supabase'),
  
  // WhatsApp
  whatsappProvider: z.enum(['twilio', 'meta']).default('twilio'),
  twilioAccountSid: z.string().optional(),
  twilioAuthToken: z.string().optional(),
  twilioWhatsappPhone: z.string().optional(),
  metaBusinessAccountId: z.string().optional(),
  metaPhoneNumberId: z.string().optional(),
  metaAccessToken: z.string().optional(),
  
  // Email
  emailProvider: z.enum(['smtp', 'sendgrid']).default('smtp'),
  smtpHost: z.string().optional(),
  smtpPort: z.coerce.number().default(587),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpFrom: z.string().optional(),
  
  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  logFormat: z.enum(['json', 'text']).default('json'),
  
  // Business Config
  businessName: z.string().default('AutoDetail Pro'),
  businessCurrency: z.string().default('ARS'),
  businessTimezone: z.string().default('America/Argentina/Buenos_Aires'),
  bookingAdvanceDays: z.coerce.number().default(90),
  bookingMinimumNoticeMin: z.coerce.number().default(30),
  checkInGraceWindowMin: z.coerce.number().default(15),
  
  // Security
  corsOrigin: z.string().default('http://localhost:5173'),
  rateLimitWindowMin: z.coerce.number().default(15),
  rateLimitMaxRequests: z.coerce.number().default(100),
  
  // Debug
  debug: z.coerce.boolean().default(false),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 */
export function parseEnv(): EnvConfig {
  const parsed = envSchema.safeParse({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    apiVersion: process.env.API_VERSION,
    apiBaseUrl: process.env.API_BASE_URL,
    frontendUrl: process.env.FRONTEND_URL,
    
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbSsl: process.env.DB_SSL,
    
    authType: process.env.AUTH_TYPE,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY,
    
    storageType: process.env.STORAGE_TYPE,
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    
    notificationsType: process.env.NOTIFICATIONS_TYPE,
    
    whatsappProvider: process.env.WHATSAPP_PROVIDER,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioWhatsappPhone: process.env.TWILIO_WHATSAPP_PHONE,
    metaBusinessAccountId: process.env.META_BUSINESS_ACCOUNT_ID,
    metaPhoneNumberId: process.env.META_PHONE_NUMBER_ID,
    metaAccessToken: process.env.META_ACCESS_TOKEN,
    
    emailProvider: process.env.EMAIL_PROVIDER,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpFrom: process.env.SMTP_FROM,
    
    logLevel: process.env.LOG_LEVEL,
    logFormat: process.env.LOG_FORMAT,
    
    businessName: process.env.BUSINESS_NAME,
    businessCurrency: process.env.BUSINESS_CURRENCY,
    businessTimezone: process.env.BUSINESS_TIMEZONE,
    bookingAdvanceDays: process.env.BOOKING_ADVANCE_DAYS,
    bookingMinimumNoticeMin: process.env.BOOKING_MINIMUM_NOTICE_MIN,
    checkInGraceWindowMin: process.env.CHECK_IN_GRACE_WINDOW_MIN,
    
    corsOrigin: process.env.CORS_ORIGIN,
    rateLimitWindowMin: process.env.RATE_LIMIT_WINDOW_MIN,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
    
    debug: process.env.DEBUG,
  });

  if (!parsed.success) {
    console.error('❌ Environment configuration error:', parsed.error.issues);
    process.exit(1);
  }

  return parsed.data;
}

export const appConfig = parseEnv();
