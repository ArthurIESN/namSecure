import { Router } from 'express';
import * as emailValidationController from '../../controllers/auth/emailValidation.js';
import { emailValidationMiddleware } from '../../middlewares/validation/auth/validation';

const router = Router();
router.get('/', emailValidationController.emailValidation);
router.post('/',emailValidationMiddleware.emailValidation, emailValidationController.emailVerify);

export default router;