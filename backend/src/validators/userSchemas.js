import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const userIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().min(2).max(80).trim().optional(),
      avatarUrl: z.string().url().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});
