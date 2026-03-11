import type { Request, Response, NextFunction } from 'express';
import { search } from './search.service.js';

export async function searchHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const q = req.query['q'];
        if (typeof q !== 'string') {
            res.status(400).json({ success: false, error: { message: 'q is required', code: 'MISSING_QUERY' } });
            return;
        }
        const results = await search(req.user!.id, q);
        res.json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
}
