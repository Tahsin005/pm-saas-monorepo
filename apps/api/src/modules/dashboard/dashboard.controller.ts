import type { Request, Response, NextFunction } from 'express';
import { getDashboardStats } from './dashboard.service.js';

export async function dashboard(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const stats = await getDashboardStats(req.user!.id);
        res.json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
}
