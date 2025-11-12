import {Router} from "express";
import * as twoFactorController from '@/controllers/auth/twoFactor';
import { twoFactorMiddleware } from "@/middlewares/validation/auth/authValidation";

const router: Router = Router();

router.get('/setup', twoFactorMiddleware.setup, twoFactorController.setup);
router.post('/setup', twoFactorMiddleware.verify, twoFactorController.setupVerify)
router.post('/verify', twoFactorMiddleware.verify, twoFactorController.verify)

export default router;