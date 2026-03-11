import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { searchHandler } from './search.controller.js';

export const searchRouter = Router();

searchRouter.get('/', authenticate, searchHandler);
