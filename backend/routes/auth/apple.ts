import {Router} from "express";
import {authValidationMiddleware} from "../../middlewares/validation/auth/validation";
import * as appleController from '../../controllers/auth/apple.js';

const router: Router = Router();

router.post('/register', authValidationMiddleware.appleRegister, appleController.register);
router.post('/login', authValidationMiddleware.appleLogin, appleController.login);

export default router;