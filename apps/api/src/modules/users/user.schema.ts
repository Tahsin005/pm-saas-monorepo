import { z } from 'zod';
import type { UpdateMeInput } from '@repo/shared-types';

export const updateMeSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').optional(),
}).refine(
    (data) => {
        // If newPassword is provided, currentPassword must also be provided
        if (data.newPassword && !data.currentPassword) return false;
        return true;
    },
    { message: 'currentPassword is required when changing password', path: ['currentPassword'] }
).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided' }
);

export type { UpdateMeInput };
