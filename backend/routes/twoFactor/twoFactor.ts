import {Router} from "express";
import { twoFactorValidationMiddleware } from "@/middlewares/validation/twoFactor/validation";
import * as twoFactorController from '@/controllers/twoFactor/twoFactor';

const router: Router = Router();

router.get('/', twoFactorValidationMiddleware.twoFactors, twoFactorController.getTwoFactors);
router.get('/:id', twoFactorValidationMiddleware.twoFactor, twoFactorController.getTwoFactor);
router.post('/', twoFactorValidationMiddleware.createTwoFactor, twoFactorController.createTwoFactor);
router.put('/', twoFactorValidationMiddleware.updateTwoFactor, twoFactorController.updateTwoFactor);
router.delete('/:id', twoFactorValidationMiddleware.twoFactor, twoFactorController.deleteTwoFactor);

export default router;