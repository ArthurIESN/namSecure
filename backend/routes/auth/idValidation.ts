import { Router } from 'express';

import * as idValidationController from '../../controllers/auth/idValidation.js';
import { idValidationMiddleware } from "../../middlewares/validation/auth/validation";
import {uploadMiddleware} from "../../middlewares/upload/upload.js";

const fileFields =
    [
        { name: 'front_id_card', maxCount: 1 },
        { name: 'back_id_card', maxCount: 1 }
    ];

const router = Router();

/**
 * @swagger
 * /auth/register/id-validation:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get ID validation page
 *     description: Retrieve ID validation information for authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: ID validation page
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID validation required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', idValidationController.idValidation);

/**
 * @swagger
 * /auth/register/id-validation:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify ID documents
 *     description: Upload and verify ID documents (front and back)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               front_id_card:
 *                 type: string
 *                 format: binary
 *                 description: Front of ID card (JPEG or PNG image)
 *               back_id_card:
 *                 type: string
 *                 format: binary
 *                 description: Back of ID card (JPEG or PNG image)
 *             required:
 *               - front_id_card
 *               - back_id_card
 *     responses:
 *       200:
 *         description: ID verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID verified successfully"
 *       400:
 *         description: Invalid file format or missing files
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/', uploadMiddleware(fileFields), idValidationMiddleware.idValidation, idValidationController.idVerify);

export default router;