import { db } from '../../db/client.js';
import { AppError } from '../../lib/AppError.js';
import type { CreateProjectInput, UpdateProjectInput } from './project.schema.js';

export async function createProject(ownerId: string, input: CreateProjectInput) {
    const project = await db.project.create({
        data: { name: input.name, ownerId },
        select: { id: true, name: true, ownerId: true, createdAt: true },
    });
    return project;
}

export async function listProjects(ownerId: string) {
    const projects = await db.project.findMany({
        where: { ownerId },
        select: { id: true, name: true, ownerId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });
    return projects;
}

export async function getProjectById(id: string, ownerId: string) {
    const project = await db.project.findUnique({
        where: { id },
        select: { id: true, name: true, ownerId: true, createdAt: true },
    });

    if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    if (project.ownerId !== ownerId) {
        throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    return project;
}

export async function updateProject(id: string, ownerId: string, input: UpdateProjectInput) {
    // Ensure project exists and belongs to this user
    await getProjectById(id, ownerId);

    const updated = await db.project.update({
        where: { id },
        data: { name: input.name },
        select: { id: true, name: true, ownerId: true, createdAt: true },
    });
    return updated;
}

export async function deleteProject(id: string, ownerId: string) {
    // Ensure project exists and belongs to this user
    await getProjectById(id, ownerId);

    await db.project.delete({ where: { id } });
}
