import jwt from 'jsonwebtoken';
import { env } from '../env.js';
import type { AuthUser } from '@repo/shared-types';

export function signToken(payload: AuthUser): string {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] & string,
    });
}

export function verifyToken(token: string): AuthUser | null {
    try {
        return jwt.verify(token, env.jwtSecret) as AuthUser;
    } catch {
        return null;
    }
}

export function signRefreshToken(payload: AuthUser): string {
    return jwt.sign(payload, env.jwtRefreshSecret, {
        expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] & string,
    });
}

export function verifyRefreshToken(token: string): AuthUser | null {
    try {
        return jwt.verify(token, env.jwtRefreshSecret) as AuthUser;
    } catch {
        return null;
    }
}
