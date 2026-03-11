import type { Request, Response, NextFunction } from 'express';
import * as taskService from './task.service.js';
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, UpdateTaskOrderInput } from './task.schema.js';
import type { TaskStatus, TaskPriority, TaskSortField, SortDir } from '@repo/shared-types';

type TaskParams = { projectId: string; taskId: string };
type ProjectParams = { projectId: string };

export async function createTask(
    req: Request<ProjectParams, object, CreateTaskInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const task = await taskService.createTask(req.params.projectId, req.user!.id, req.body);
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
}

export async function listTasks(
    req: Request<ProjectParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { status, priority, tag, overdue, sort, dir, page, limit } = req.query as {
            status?: TaskStatus;
            priority?: TaskPriority;
            tag?: string;
            overdue?: string;
            sort?: TaskSortField;
            dir?: SortDir;
            page?: string;
            limit?: string;
        };
        const result = await taskService.listTasks(req.params.projectId, req.user!.id, {
            ...(status && { status }),
            ...(priority && { priority }),
            ...(tag && { tag }),
            ...(overdue === 'true' && { overdue: true }),
            ...(sort && { sort }),
            ...(dir && { dir }),
            ...(page && { page: Number(page) }),
            ...(limit && { limit: Number(limit) }),
        });
        res.json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function getTask(
    req: Request<TaskParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const task = await taskService.getTaskById(req.params.taskId, req.params.projectId, req.user!.id);
        res.json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
}

export async function updateTask(
    req: Request<TaskParams, object, UpdateTaskInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const task = await taskService.updateTask(req.params.taskId, req.params.projectId, req.user!.id, req.body);
        res.json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
}

export async function updateTaskStatus(
    req: Request<TaskParams, object, UpdateTaskStatusInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const task = await taskService.updateTaskStatus(req.params.taskId, req.params.projectId, req.user!.id, req.body);
        res.json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
}

export async function updateTaskOrder(
    req: Request<TaskParams, object, UpdateTaskOrderInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const task = await taskService.updateTaskOrder(req.params.taskId, req.params.projectId, req.user!.id, req.body);
        res.json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
}

export async function deleteTask(
    req: Request<TaskParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await taskService.deleteTask(req.params.taskId, req.params.projectId, req.user!.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
