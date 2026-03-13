import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import * as authController from './auth.controller.js';

export const authRouter: Router = Router();

// POST /api/v1/auth/register
authRouter.post('/register', validate(registerSchema), authController.register);

// POST /api/v1/auth/login
authRouter.post('/login', validate(loginSchema), authController.login);

// POST /api/v1/auth/refresh  — reads httpOnly cookie, issues new access token
authRouter.post('/refresh', authController.refresh);

// POST /api/v1/auth/logout   — clears refresh token cookie + revokes from DB
authRouter.post('/logout', authController.logout);

// GET /api/v1/auth/me  (protected)
authRouter.get('/me', authenticate, authController.me);
