import {Router} from 'express';
import * as loginController from '@/controllers/auth/login';
import {loginValidatorMiddleware} from "@/middlewares/validation/auth/validation";

const router: Router = Router();
router.post('/', loginValidatorMiddleware.login, loginController.login);

export default router;