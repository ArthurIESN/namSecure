import Router from 'express-promise-router';
import { Router as ExpressRouter } from 'express';
import { isAuthentificated } from "../../middlewares/auth/isAuthentificated.js";
import { registerValidatorMiddleware} from "../../middlewares/validation/validation.js";
import * as registerController from '../../controllers/auth/register.js';

const router: ExpressRouter = Router();
router.post('/', registerValidatorMiddleware.register, registerController.register);
router.post('/request-email-validation',isAuthentificated, registerController.requestEmailValidation);

export default router;