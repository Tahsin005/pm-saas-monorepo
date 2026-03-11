import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from './task.schema.js';
import * as taskController from './task.controller.js';

export const taskRouter = Router({ mergeParams: true });

taskRouter.use(authenticate);

taskRouter.post('/', validate(createTaskSchema), taskController.createTask);
taskRouter.get('/', taskController.listTasks);
taskRouter.get('/:taskId', taskController.getTask);
taskRouter.patch('/:taskId', validate(updateTaskSchema), taskController.updateTask);
taskRouter.patch('/:taskId/status', validate(updateTaskStatusSchema), taskController.updateTaskStatus);
taskRouter.delete('/:taskId', taskController.deleteTask);
