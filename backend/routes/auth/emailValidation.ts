import { Router } from 'express';
import * as emailValidationController from '../../controllers/auth/emailValidation.js';
import { emailValidationMiddleware } from '../../middlewares/validation/auth/validation';

const router = Router();

/**
 * @swagger
 * /auth/register/email-validation:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get email validation page
 *     description: Retrieve email validation information for authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Email validation page
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email validation required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', emailValidationController.emailValidation);

/**
 * @swagger
 * /auth/register/email-validation:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify email address
 *     description: Verify email address with validation code
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Email validation code (6 uppercase alphanumeric characters)
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       400:
 *         description: Invalid validation code
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/',emailValidationMiddleware.emailValidation, emailValidationController.emailVerify);

export default router;