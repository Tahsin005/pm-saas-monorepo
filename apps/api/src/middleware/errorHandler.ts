import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError.js';
import { env } from '../env.js';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
        });
        return;
    }

    if (env.nodeEnv === 'development') {
        console.error(err);
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
    });
}
