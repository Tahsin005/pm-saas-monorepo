import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
