import { Router } from 'express';
import {memberValidatorMiddleware} from "@/middlewares/validation/member/validation";
import {isFullyAuthenticated} from "@/middlewares/auth/isFullyAuthenticated";
import * as passwordController from '@/controllers/member/password.js';
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";


const router: Router = Router();

router.post('/reset', memberValidatorMiddleware.passwordReset, passwordController.reset);
router.post('/change', memberValidatorMiddleware.passwordChange, isAuthenticated, isFullyAuthenticated, passwordController.change);
router.post('/verify', memberValidatorMiddleware.passwordVerify, isAuthenticated, isFullyAuthenticated, passwordController.verify);

export default router;