import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './modules/auth/auth.routes.js';
import { projectRouter } from './modules/projects/project.routes.js';
import { taskRouter } from './modules/tasks/task.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
    const app = express();

    // Core middleware
    app.use(cors({ credentials: true, origin: true }));
    app.use(express.json());
    app.use(cookieParser());

    // Health check
    app.get('/api/health', (_req, res) => {
        res.json({ success: true, message: 'API is healthy' });
    });

    // Routes
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/projects', projectRouter);
    app.use('/api/v1/projects/:projectId/tasks', taskRouter);

    // Global error handler
    app.use(errorHandler);

    return app;
}
