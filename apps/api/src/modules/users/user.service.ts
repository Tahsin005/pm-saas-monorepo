import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import type { UpdateMeInput } from './user.schema.js';

export async function getMe(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
}

export async function updateMe(userId: string, input: UpdateMeInput) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, passwordHash: true },
    });

    if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Validate email uniqueness if changing
    if (input.email && input.email !== user.email) {
        const existing = await db.user.findUnique({ where: { email: input.email } });
        if (existing) {
            throw new AppError('Email already in use', 409, 'EMAIL_TAKEN');
        }
    }

    // Validate current password if changing password
    if (input.newPassword) {
        if (!input.currentPassword) {
            throw new AppError('currentPassword is required', 400, 'MISSING_CURRENT_PASSWORD');
        }
        const valid = await verifyPassword(input.currentPassword, user.passwordHash);
        if (!valid) {
            throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
        }
    }

    const updated = await db.user.update({
        where: { id: userId },
        data: {
            ...(input.email && { email: input.email }),
            ...(input.newPassword && { passwordHash: await hashPassword(input.newPassword) }),
        },
        select: { id: true, email: true, createdAt: true },
    });

    return updated;
}
