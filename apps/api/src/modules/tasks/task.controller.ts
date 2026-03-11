import type { Request, Response, NextFunction } from 'express';
import * as taskService from './task.service.js';
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from './task.schema.js';

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
        const tasks = await taskService.listTasks(req.params.projectId, req.user!.id);
        res.json({ success: true, data: tasks });
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
