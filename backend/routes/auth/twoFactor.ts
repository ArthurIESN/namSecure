import {Router} from "express";
import * as twoFactorController from '../../controllers/auth/twoFactor.js';

const router = Router();

router.post('/setup', twoFactorController.setup);
router.post('/verify', twoFactorController.verify)

export default router;