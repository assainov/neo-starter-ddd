import { z } from 'zod';

const validationSchema = z.object({
  HOST: z.string().min(5).default('localhost'),
  PORT: z.coerce.number().min(1000),
  NODE_ENV: z
    .union([
      z.literal('development'),
      z.literal('test'),
      z.literal('staging'),
      z.literal('staging'),
      z.literal('production'),
    ])
    .default('development'),

  CORS_ORIGIN: z.string().min(5),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(1000),
  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1).default(20),

  DATABASE_URL: z.string().url(),

  LOG_LEVEL: z
    .union([
      z.literal('trace'),
      z.literal('debug'),
      z.literal('info'),
      z.literal('warn'),
      z.literal('error'),
      z.literal('fatal'),
    ])
    .default('info'),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  ACCESS_EXPIRY_MINUTES: z.coerce.number().min(1).default(10),
  REFRESH_EXPIRY_DAYS: z.coerce.number().min(1).default(30),

  isProduction: z.boolean().default(false),
});

export const validate = (config: Record<string, unknown>) => validationSchema.parse(config);