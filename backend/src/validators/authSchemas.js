import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).trim(),
    email: z.string().email().trim().transform((value) => value.toLowerCase()),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim().transform((value) => value.toLowerCase()),
    password: z.string().min(8),
  }),
});
