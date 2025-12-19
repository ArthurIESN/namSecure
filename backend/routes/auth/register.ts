import { Router } from 'express';
import { isAuthenticated } from "../../middlewares/auth/isAuthenticated.js";
import { emailValidationState } from "../../middlewares/auth/emailValidationState.js";
import { idValidationState } from "../../middlewares/auth/idValidationState.js";
import { registerValidatorMiddleware } from "../../middlewares/validation/auth/validation";
import * as registerController from '../../controllers/auth/register.js';
import emailValidationRouter from './emailValidation.js';
import idValidationRouter from './idValidation.js';


const router: Router = Router();
router.post('/', registerValidatorMiddleware.register, registerController.register);

router.use('/email-validation', isAuthenticated, emailValidationState, emailValidationRouter);
router.use('/id-validation', isAuthenticated, idValidationState, idValidationRouter);

export default router;