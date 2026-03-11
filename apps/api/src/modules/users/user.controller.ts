import type { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import type { UpdateMeInput } from './user.schema.js';

export async function getMe(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await userService.getMe(req.user!.id);
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
}

export async function updateMe(
    req: Request<object, object, UpdateMeInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await userService.updateMe(req.user!.id, req.body);
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
}
