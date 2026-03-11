import { z } from 'zod';
import type { CreateProjectInput, UpdateProjectInput } from '@repo/shared-types';

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
}) satisfies z.ZodType<CreateProjectInput>;

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
}) satisfies z.ZodType<UpdateProjectInput>;

export type { CreateProjectInput, UpdateProjectInput };
