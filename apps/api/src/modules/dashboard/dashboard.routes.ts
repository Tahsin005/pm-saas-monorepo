import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { dashboard } from './dashboard.controller.js';

export const dashboardRouter: Router = Router();

dashboardRouter.get('/', authenticate, dashboard);
