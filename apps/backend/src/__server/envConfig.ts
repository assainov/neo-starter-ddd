import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const validationSchema = z.object({
  HOST: z.string().min(5).default('localhost'),
  PORT: z.coerce.number().min(1000),
  NODE_ENV: z
    .union([
      z.literal('development'),
      z.literal('test'),
      z.literal('production'),
    ])
    .default('development'),

  CORS_ORIGIN: z.string().min(5),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(1000),
  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1).default(20),

  DATABASE_HOST: z.string().min(5),
  DATABASE_PORT: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),

  MIN_LOG_LEVEL: z
    .union([
      z.literal('trace'),
      z.literal('debug'),
      z.literal('info'),
      z.literal('warn'),
      z.literal('error'),
      z.literal('fatal'),
    ])
    .default('info'),

  JWT_SECRET: z.string().min(1),

  isProduction: z.boolean().default(false),
});

export const envConfig = validationSchema.parse({ ...process.env, isProduction: process.env.NODE_ENV === 'production' });
export type EnvConfig = typeof envConfig;