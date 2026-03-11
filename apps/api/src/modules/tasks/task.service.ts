import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from './task.schema.js';

// ensure the project exists and belongs to the requesting user.
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

    const task = await db.task.create({
        data: {
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? 'TODO',
            projectId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            projectId: true,
            createdAt: true,
        },
    });

    return task;
}

export async function listTasks(projectId: string, ownerId: string) {
    await assertProjectOwnership(projectId, ownerId);

    const tasks = await db.task.findMany({
        where: { projectId },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            projectId: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    return tasks;
}

export async function getTaskById(taskId: string, projectId: string, ownerId: string) {
    await assertProjectOwnership(projectId, ownerId);

    const task = await db.task.findUnique({
        where: { id: taskId },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            projectId: true,
            createdAt: true,
        },
    });

    if (!task) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    // Ensure the task actually belongs to this project (not just any project)
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
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            projectId: true,
            createdAt: true,
        },
    });

    return updated;
}

export async function updateTaskStatus(taskId: string, projectId: string, ownerId: string, input: UpdateTaskStatusInput) {
    await getTaskById(taskId, projectId, ownerId);

    const updated = await db.task.update({
        where: { id: taskId },
        data: { status: input.status },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            projectId: true,
            createdAt: true,
        },
    });

    return updated;
}

export async function deleteTask(taskId: string, projectId: string, ownerId: string) {
    await getTaskById(taskId, projectId, ownerId);
    await db.task.delete({ where: { id: taskId } });
}
