import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema } from 'zod';
import { AppError } from '../lib/AppError.js';

export function validate(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues.map((e) => e.message).join(', ');
            next(new AppError(message, 400, 'VALIDATION_ERROR'));
            return;
        }

        req.body = result.data;
        next();
    };
}
