import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { updateMeSchema } from './user.schema.js';
import * as userController from './user.controller.js';

export const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/me', userController.getMe);
userRouter.patch('/me', validate(updateMeSchema), userController.updateMe);
