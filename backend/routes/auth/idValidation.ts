import { Router } from 'express';

import * as idValidationController from '../../controllers/auth/idValidation.js';
import { idValidationMiddleware } from "../../middlewares/validation/auth/authValidation.js";
import {uploadMiddleware} from "../../middlewares/upload/upload.js";

const fileFields =
    [
        { name: 'front_id_card', maxCount: 1 },
        { name: 'back_id_card', maxCount: 1 }
    ];

const router = Router();
router.get('/', idValidationController.idValidation);
router.post('/', uploadMiddleware(fileFields), idValidationMiddleware.idValidation, idValidationController.idVerify);

export default router;