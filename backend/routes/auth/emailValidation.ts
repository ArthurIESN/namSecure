import { Router } from 'express';
import * as emailValidationController from '../../controllers/auth/emailValidation.js';
import { emailValidationMiddleware } from '../../middlewares/validation/auth/authValidation.js';

const router = Router();
router.get('/', emailValidationController.emailValidation);
router.post('/',emailValidationMiddleware.emailVerify, emailValidationController.emailVerify);

export default router;