import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { signToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function issueTokens(userId: string, email: string) {
    const accessToken = signToken({ id: userId, email });
    const refreshToken = signRefreshToken({ id: userId, email });
    return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
    const existing = await db.user.findUnique({
        where: { email: input.email },
    });

    if (existing) {
        throw new AppError('Email already in use', 409, 'EMAIL_TAKEN');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await db.user.create({
        data: { email: input.email, passwordHash },
        select: { id: true, email: true, createdAt: true },
    });

    const { accessToken, refreshToken } = issueTokens(user.id, user.email);

    await db.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
    });

    return { user, accessToken, refreshToken };
}

export async function login(input: LoginInput) {
    const user = await db.user.findUnique({ where: { email: input.email } });

    if (!user) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await verifyPassword(input.password, user.passwordHash);

    if (!valid) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const { accessToken, refreshToken } = issueTokens(user.id, user.email);

    await db.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
    });

    return {
        user: { id: user.id, email: user.email, createdAt: user.createdAt },
        accessToken,
        refreshToken,
    };
}

export async function refresh(token: string) {
    // 1. Verify JWT signature
    const payload = verifyRefreshToken(token);
    if (!payload) {
        throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // 2. Check token exists in DB (not revoked)
    const stored = await db.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
        throw new AppError('Refresh token revoked or expired', 401, 'REFRESH_TOKEN_EXPIRED');
    }

    // 3. Rotate — delete old, issue new
    await db.refreshToken.delete({ where: { token } });

    const newAccessToken = signToken({ id: payload.id, email: payload.email });
    const newRefreshToken = signRefreshToken({ id: payload.id, email: payload.email });

    await db.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: payload.id,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(token: string) {
    // Silently succeed even if token not found (already logged out)
    await db.refreshToken.deleteMany({ where: { token } });
}
