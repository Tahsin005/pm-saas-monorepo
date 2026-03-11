import { db } from '../../db/client.js';

export async function getDashboardStats(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [
        projectGroups,
        taskGroups,
        overdueCount,
        completedThisWeek,
        recentProject,
    ] = await Promise.all([
        // Projects grouped by status
        db.project.groupBy({
            by: ['status'],
            where: { ownerId: userId },
            _count: { _all: true },
        }),
        // Tasks grouped by status across all user's projects
        db.task.groupBy({
            by: ['status'],
            where: { project: { ownerId: userId } },
            _count: { _all: true },
        }),
        // Overdue tasks (dueAt in the past, not DONE)
        db.task.count({
            where: {
                project: { ownerId: userId },
                dueAt: { lt: now },
                status: { not: 'DONE' },
            },
        }),
        // Tasks moved to DONE this week
        db.task.count({
            where: {
                project: { ownerId: userId },
                status: 'DONE',
                updatedAt: { gte: startOfWeek },
            },
        }),
        // Most recently updated project
        db.project.findFirst({
            where: { ownerId: userId },
            orderBy: { updatedAt: 'desc' },
            select: { id: true, name: true, updatedAt: true },
        }),
    ]);

    const projects = { total: 0, ACTIVE: 0, ARCHIVED: 0, COMPLETED: 0 };
    for (const g of projectGroups) {
        projects[g.status] = g._count._all;
        projects.total += g._count._all;
    }

    const taskStats = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    let taskTotal = 0;
    for (const g of taskGroups) {
        taskStats[g.status] = g._count._all;
        taskTotal += g._count._all;
    }

    return {
        projects,
        tasks: {
            ...taskStats,
            total: taskTotal,
            overdue: overdueCount,
            completedThisWeek,
        },
        recentProject,
    };
}
