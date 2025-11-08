import {Router} from "express";
import * as twoFactorController from '../../controllers/auth/twoFactor.js';

const router = Router();

router.get('/setup', twoFactorController.setup);
router.post('/setup', twoFactorController.setupVerify)
router.post('/verify', twoFactorController.verify)

export default router;