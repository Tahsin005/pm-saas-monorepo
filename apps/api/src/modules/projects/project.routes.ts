import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from './project.schema.js';
import * as projectController from './project.controller.js';

export const projectRouter: Router = Router();

projectRouter.use(authenticate);

projectRouter.post('/', validate(createProjectSchema), projectController.createProject);
projectRouter.get('/', projectController.listProjects);
projectRouter.get('/:id', projectController.getProject);
projectRouter.patch('/:id', validate(updateProjectSchema), projectController.updateProject);
projectRouter.delete('/:id', projectController.deleteProject);
