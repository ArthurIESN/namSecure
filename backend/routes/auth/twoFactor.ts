import {Router} from "express";
import * as twoFactorController from '@/controllers/auth/twoFactor';
import { twoFactorMiddleware } from "@/middlewares/validation/auth/validation";
import {isFullyAuthenticated} from "@/middlewares/auth/isFullyAuthenticated";

const router: Router = Router();

router.get('/setup',isFullyAuthenticated, twoFactorMiddleware.setup, twoFactorController.setup);
router.post('/setup',isFullyAuthenticated, twoFactorMiddleware.verify, twoFactorController.setupVerify)
router.post('/verify', twoFactorMiddleware.verify, twoFactorController.verify)

export default router;