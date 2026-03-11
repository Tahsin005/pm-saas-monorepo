import { z } from 'zod';
import { TASK_STATUS_VALUES, TASK_PRIORITY_VALUES } from '@repo/shared-types';
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, UpdateTaskOrderInput } from '@repo/shared-types';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required').max(200, 'Task title too long'),
    description: z.string().max(2000, 'Description too long').optional(),
    status: z.enum(TASK_STATUS_VALUES).optional(),
    priority: z.enum(TASK_PRIORITY_VALUES).optional(),
    dueAt: z.string().datetime({ message: 'Invalid date format, use ISO 8601' }).optional(),
    tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags').optional(),
    parentId: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required').max(200, 'Task title too long').optional(),
    description: z.string().max(2000, 'Description too long').nullable().optional(),
    priority: z.enum(TASK_PRIORITY_VALUES).optional(),
    dueAt: z.string().datetime({ message: 'Invalid date format, use ISO 8601' }).nullable().optional(),
    tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags').optional(),
    parentId: z.string().nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});

export const updateTaskStatusSchema = z.object({
    status: z.enum(TASK_STATUS_VALUES),
}) satisfies z.ZodType<UpdateTaskStatusInput>;

export const updateTaskOrderSchema = z.object({
    order: z.number(),
}) satisfies z.ZodType<UpdateTaskOrderInput>;

export type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, UpdateTaskOrderInput };
