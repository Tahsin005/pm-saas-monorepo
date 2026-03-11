import { z } from 'zod';
import { TASK_STATUS_VALUES } from '@repo/shared-types';
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from '@repo/shared-types';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required').max(200, 'Task title too long'),
    description: z.string().max(2000, 'Description too long').optional(),
    status: z.enum(TASK_STATUS_VALUES).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required').max(200, 'Task title too long').optional(),
    description: z.string().max(2000, 'Description too long').optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});

export const updateTaskStatusSchema = z.object({
    status: z.enum(TASK_STATUS_VALUES),
}) satisfies z.ZodType<UpdateTaskStatusInput>;

export type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput };
