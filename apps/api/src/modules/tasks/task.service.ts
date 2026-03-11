import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, UpdateTaskOrderInput } from './task.schema.js';
import type { TaskListQuery } from '@repo/shared-types';

const taskSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    order: true,
    dueAt: true,
    tags: true,
    projectId: true,
    parentId: true,
    createdAt: true,
    updatedAt: true,
} as const;

// Ensure the project exists and belongs to the requesting user.
async function assertProjectOwnership(projectId: string, ownerId: string) {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
    });

    if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    if (project.ownerId !== ownerId) {
        throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }
}

export async function createTask(projectId: string, ownerId: string, input: CreateTaskInput) {
    await assertProjectOwnership(projectId, ownerId);

    // Place new task at the end of the list
    const last = await db.task.findFirst({
        where: { projectId, parentId: null },
        orderBy: { order: 'desc' },
        select: { order: true },
    });
    const order = (last?.order ?? 0) + 1000;

    const task = await db.task.create({
        data: {
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? 'TODO',
            priority: input.priority ?? 'MEDIUM',
            dueAt: input.dueAt ? new Date(input.dueAt) : null,
            tags: input.tags ?? [],
            parentId: input.parentId ?? null,
            order,
            projectId,
        },
        select: taskSelect,
    });

    return task;
}

export async function listTasks(projectId: string, ownerId: string, query: TaskListQuery = {}) {
    await assertProjectOwnership(projectId, ownerId);

    const { status, priority, tag, overdue, sort = 'order', dir = 'asc', page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;
    const now = new Date();

    const where = {
        projectId,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(tag && { tags: { has: tag } }),
        ...(overdue && { dueAt: { lt: now }, status: { not: 'DONE' as const } }),
    };

    const orderBy = sort === 'priority'
        // Map priority enum to numeric sort weight via raw ordering
        ? [{ priority: dir }, { order: 'asc' as const }]
        : [{ [sort]: dir }];

    const [items, total] = await Promise.all([
        db.task.findMany({ where, select: taskSelect, orderBy, skip, take: limit }),
        db.task.count({ where }),
    ]);

    return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}

export async function getTaskById(taskId: string, projectId: string, ownerId: string) {
    await assertProjectOwnership(projectId, ownerId);

    const task = await db.task.findUnique({
        where: { id: taskId },
        select: taskSelect,
    });

    if (!task) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    if (task.projectId !== projectId) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return task;
}

export async function updateTask(taskId: string, projectId: string, ownerId: string, input: UpdateTaskInput) {
    await getTaskById(taskId, projectId, ownerId);

    const updated = await db.task.update({
        where: { id: taskId },
        data: {
            ...(input.title !== undefined && { title: input.title }),
            ...(input.description !== undefined && { description: input.description }),
            ...(input.priority !== undefined && { priority: input.priority }),
            ...(input.dueAt !== undefined && { dueAt: input.dueAt ? new Date(input.dueAt) : null }),
            ...(input.tags !== undefined && { tags: input.tags }),
            ...(input.parentId !== undefined && { parentId: input.parentId }),
        },
        select: taskSelect,
    });

    return updated;
}

export async function updateTaskStatus(taskId: string, projectId: string, ownerId: string, input: UpdateTaskStatusInput) {
    await getTaskById(taskId, projectId, ownerId);

    const updated = await db.task.update({
        where: { id: taskId },
        data: { status: input.status },
        select: taskSelect,
    });

    return updated;
}

export async function updateTaskOrder(taskId: string, projectId: string, ownerId: string, input: UpdateTaskOrderInput) {
    await getTaskById(taskId, projectId, ownerId);

    const updated = await db.task.update({
        where: { id: taskId },
        data: { order: input.order },
        select: taskSelect,
    });

    return updated;
}

export async function deleteTask(taskId: string, projectId: string, ownerId: string) {
    await getTaskById(taskId, projectId, ownerId);
    await db.task.delete({ where: { id: taskId } });
}
