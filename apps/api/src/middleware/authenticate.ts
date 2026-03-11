import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { AppError } from '../lib/AppError.js';
import type { AuthUser } from '@repo/shared-types';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
        next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
        return;
    }

    const token = header.split(' ')[1];

    if (!token) {
        next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
        return;
    }

    const payload = verifyToken(token);

    if (!payload) {
        next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
        return;
    }

    req.user = payload;
    next();
}
