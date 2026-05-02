import { z } from 'zod';
import { objectIdSchema } from './common.js';

const statusSchema = z.enum(['todo', 'in_progress', 'review', 'done']);
const prioritySchema = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(2).max(140).trim(),
    description: z.string().max(2000).trim().optional(),
    status: statusSchema.optional(),
    priority: prioritySchema.optional(),
    dueDate: z.string().datetime({ offset: true }).optional(),
    order: z.number().int().min(0).optional(),
    assignees: z.array(objectIdSchema).optional(),
    tags: z.array(z.string().max(30).trim()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
    taskId: objectIdSchema,
  }),
  body: z
    .object({
      title: z.string().min(2).max(140).trim().optional(),
      description: z.string().max(2000).trim().optional(),
      status: statusSchema.optional(),
      priority: prioritySchema.optional(),
      dueDate: z.string().datetime({ offset: true }).optional(),
      order: z.number().int().min(0).optional(),
      assignees: z.array(objectIdSchema).optional(),
      tags: z.array(z.string().max(30).trim()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});
