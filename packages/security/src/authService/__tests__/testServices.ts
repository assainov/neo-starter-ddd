import z from 'zod';
import { EncryptionService, TokenService } from '../services';
import { mockLogger } from './mocks';

const envConfigSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  ACCESS_EXPIRY_MINUTES: z.coerce.number().min(1),
  REFRESH_EXPIRY_DAYS: z.coerce.number().min(1),
});

const envConfig = envConfigSchema.parse(process.env);

export const testServices = {
  encryptionService: new EncryptionService(),
  tokenService: new TokenService({ envConfig, logger: mockLogger })
};