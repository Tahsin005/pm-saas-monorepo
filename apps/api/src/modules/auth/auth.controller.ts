import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';
import { AppError } from '../../lib/AppError.js';
import { env } from '../../env.js';

const COOKIE_NAME = 'refreshToken';

const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

function setRefreshCookie(res: Response, token: string) {
    res.cookie(COOKIE_NAME, token, cookieOptions);
}

function clearRefreshCookie(res: Response) {
    res.clearCookie(COOKIE_NAME, cookieOptions);
}

export async function register(
    req: Request<object, object, RegisterInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { user, accessToken, refreshToken } = await authService.register(req.body);
        setRefreshCookie(res, refreshToken);
        res.status(201).json({ success: true, data: { user, accessToken } });
    } catch (err) {
        next(err);
    }
}

export async function login(
    req: Request<object, object, LoginInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        setRefreshCookie(res, refreshToken);
        res.json({ success: true, data: { user, accessToken } });
    } catch (err) {
        next(err);
    }
}

export async function refresh(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token: string | undefined = req.cookies[COOKIE_NAME];
        if (!token) {
            throw new AppError('No refresh token', 401, 'NO_REFRESH_TOKEN');
        }
        const { accessToken, refreshToken } = await authService.refresh(token);
        setRefreshCookie(res, refreshToken);
        res.json({ success: true, data: { accessToken } });
    } catch (err) {
        next(err);
    }
}

export async function logout(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token: string | undefined = req.cookies[COOKIE_NAME];
        if (token) {
            await authService.logout(token);
        }
        clearRefreshCookie(res);
        res.json({ success: true, message: 'Logged out' });
    } catch (err) {
        next(err);
    }
}

export function me(req: Request, res: Response): void {
    res.json({ success: true, data: req.user });
}
