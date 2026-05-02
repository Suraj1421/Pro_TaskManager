import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120).trim(),
    description: z.string().max(500).trim().optional(),
    status: z.enum(['active', 'archived']).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(120).trim().optional(),
      description: z.string().max(500).trim().optional(),
      status: z.enum(['active', 'archived']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const addMemberSchema = z.object({
  body: z.object({
    userId: objectIdSchema,
    role: z.enum(['owner', 'admin', 'member']).optional(),
  }),
});

export const updateMemberSchema = z.object({
  params: z.object({
    id: objectIdSchema,
    memberId: objectIdSchema,
  }),
  body: z.object({
    role: z.enum(['admin', 'member']),
  }),
});
