import { z } from 'zod';
import { PROJECT_STATUS_VALUES } from '@repo/shared-types';
import type { CreateProjectInput, UpdateProjectInput } from '@repo/shared-types';

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
    description: z.string().max(500, 'Description too long').optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long').optional(),
    description: z.string().max(500, 'Description too long').optional(),
    status: z.enum(PROJECT_STATUS_VALUES).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});

export type { CreateProjectInput, UpdateProjectInput };
