import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';
import type { CreateProjectInput, UpdateProjectInput } from './project.schema.js';
import type { ProjectListQuery } from '@repo/shared-types';

const projectSelect = {
    id: true,
    name: true,
    description: true,
    status: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
} as const;

export async function createProject(ownerId: string, input: CreateProjectInput) {
    const project = await db.project.create({
        data: {
            name: input.name,
            description: input.description ?? null,
            ownerId,
        },
        select: projectSelect,
    });
    return project;
}

export async function listProjects(ownerId: string, query: ProjectListQuery = {}) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = {
        ownerId,
        ...(status && { status }),
    };

    const [items, total] = await Promise.all([
        db.project.findMany({
            where,
            select: projectSelect,
            orderBy: { updatedAt: 'desc' },
            skip,
            take: limit,
        }),
        db.project.count({ where }),
    ]);

    return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}

export async function getProjectById(id: string, ownerId: string) {
    const project = await db.project.findUnique({
        where: { id },
        select: projectSelect,
    });

    if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    if (project.ownerId !== ownerId) {
        throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    return project;
}

export async function getProjectWithStats(id: string, ownerId: string) {
    const project = await getProjectById(id, ownerId);
    const now = new Date();

    const [statusGroups, overdueCount] = await Promise.all([
        db.task.groupBy({
            by: ['status'],
            where: { projectId: id },
            _count: { _all: true },
        }),
        db.task.count({
            where: { projectId: id, dueAt: { lt: now }, status: { not: 'DONE' } },
        }),
    ]);

    const taskStats = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    for (const g of statusGroups) {
        taskStats[g.status] = g._count._all;
    }
    const total = taskStats.TODO + taskStats.IN_PROGRESS + taskStats.DONE;
    const completionPercent = total === 0 ? 0 : Math.round((taskStats.DONE / total) * 100);

    return { ...project, taskStats, completionPercent, overdueCount };
}

export async function updateProject(id: string, ownerId: string, input: UpdateProjectInput) {
    await getProjectById(id, ownerId);

    const updated = await db.project.update({
        where: { id },
        data: {
            ...(input.name !== undefined && { name: input.name }),
            ...(input.description !== undefined && { description: input.description }),
            ...(input.status !== undefined && { status: input.status }),
        },
        select: projectSelect,
    });
    return updated;
}

export async function deleteProject(id: string, ownerId: string) {
    await getProjectById(id, ownerId);
    await db.project.delete({ where: { id } });
}
