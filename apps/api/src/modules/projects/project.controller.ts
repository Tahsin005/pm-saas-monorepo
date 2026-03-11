import type { Request, Response, NextFunction } from 'express';
import * as projectService from './project.service.js';
import type { CreateProjectInput, UpdateProjectInput } from './project.schema.js';
import type { ProjectStatus } from '@repo/shared-types';

export async function createProject(
    req: Request<object, object, CreateProjectInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const project = await projectService.createProject(req.user!.id, req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

export async function listProjects(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { status, page, limit } = req.query as {
            status?: ProjectStatus;
            page?: string;
            limit?: string;
        };
        const result = await projectService.listProjects(req.user!.id, {
            ...(status && { status }),
            ...(page && { page: Number(page) }),
            ...(limit && { limit: Number(limit) }),
        });
        res.json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function getProject(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const project = await projectService.getProjectWithStats(req.params.id, req.user!.id);
        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

export async function updateProject(
    req: Request<{ id: string }, object, UpdateProjectInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const project = await projectService.updateProject(req.params.id, req.user!.id, req.body);
        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

export async function deleteProject(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await projectService.deleteProject(req.params.id, req.user!.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
