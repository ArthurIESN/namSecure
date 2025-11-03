import { Router } from 'express';
import {memberValidatorMiddleware} from "../../middlewares/validation/validation.js";
import {isFullyAuthenticated} from "../../middlewares/auth/isFullyAuthenticated.js";
import * as passwordController from '../../controllers/member/password.js';
import {isAuthenticated} from "../../middlewares/auth/isAuthenticated.js";


const router: Router = Router();

router.post('/reset', memberValidatorMiddleware.passwordReset, passwordController.reset);
router.post('/change', memberValidatorMiddleware.passwordChange, isAuthenticated, isFullyAuthenticated, passwordController.change);

export default router;