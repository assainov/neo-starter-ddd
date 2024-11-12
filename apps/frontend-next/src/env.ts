import { z } from 'zod';
import 'dotenv/config';

const validationSchema = z.object({
  API_URL: z.string(),
  APP_URL: z.string().optional().default('http://localhost:3000'),
  isDevelopment: z.boolean(),
});

const envVars = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  APP_URL: process.env.NEXT_PUBLIC_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
};

export const env = validationSchema.parse(envVars);
export type Env = typeof env;