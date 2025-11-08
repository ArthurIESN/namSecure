import {Router} from 'express';
import * as loginController from '../../controllers/auth/login.js';
import {loginValidatorMiddleware} from "../../middlewares/validation/auth/authValidation.js";

const router: Router = Router();
router.post('/', loginValidatorMiddleware.login, loginController.login);

export default router;