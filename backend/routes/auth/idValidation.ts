import { Router } from 'express';

import * as idValidationController from '../../controllers/auth/idValidation.js';

const router = Router();
router.get('/', idValidationController.idValidation);
router.post('/');

export default router;