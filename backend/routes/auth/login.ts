import Router from 'express-promise-router';
import { Router as ExpressRouter } from 'express';
import * as loginController from '../../controllers/auth/login.js';
import {loginValidatorMiddleware} from "../../middlewares/validation/auth/authValidation.js";

const router: ExpressRouter = Router();
router.post('/', loginValidatorMiddleware.login, loginController.login);

export default router;