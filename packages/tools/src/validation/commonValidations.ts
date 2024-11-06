import { z } from 'zod';

export const commonValidations = {
  id: z
    .string()
    .min(1)
  // ... other common validations
};