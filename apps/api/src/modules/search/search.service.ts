import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';

export async function search(userId: string, q: string) {
    if (!q || q.trim().length < 2) {
        throw new AppError('Search query must be at least 2 characters', 400, 'QUERY_TOO_SHORT');
    }

    const term = q.trim();

    const [projects, tasks] = await Promise.all([
        db.project.findMany({
            where: {
                ownerId: userId,
                name: { contains: term, mode: 'insensitive' },
            },
            select: { id: true, name: true, status: true, updatedAt: true },
            take: 10,
            orderBy: { updatedAt: 'desc' },
        }),
        db.task.findMany({
            where: {
                project: { ownerId: userId },
                OR: [
                    { title: { contains: term, mode: 'insensitive' } },
                    { description: { contains: term, mode: 'insensitive' } },
                ],
            },
            select: { id: true, title: true, status: true, priority: true, projectId: true },
            take: 20,
            orderBy: { updatedAt: 'desc' },
        }),
    ]);

    return { projects, tasks };
}
