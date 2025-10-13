import Router from 'express-promise-router';
import { Router as ExpressRouter } from 'express';
import * as loginController from '../../controllers/auth/login.js';

const router: ExpressRouter = Router();
router.post('/', loginController.login);

export default router;