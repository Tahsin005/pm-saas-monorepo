import { z } from 'zod';
import type { RegisterInput, LoginInput } from '@repo/shared-types';

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
}) satisfies z.ZodType<RegisterInput>;

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
}) satisfies z.ZodType<LoginInput>;

export type { RegisterInput, LoginInput };
