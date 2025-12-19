import {Router} from "express";
import * as twoFactorController from '@/controllers/auth/twoFactor';
import { twoFactorMiddleware } from "@/middlewares/validation/auth/validation";
import {isFullyAuthenticated} from "@/middlewares/auth/isFullyAuthenticated";

const router: Router = Router();

/**
 * @swagger
 * /auth/2fa/setup:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get 2FA setup information
 *     description: Retrieve two-factor authentication setup details (QR code and secret)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   description: QR code for authenticator app
 *                 secret:
 *                   type: string
 *                   description: Secret key for manual entry
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/setup',isFullyAuthenticated, twoFactorMiddleware.setup, twoFactorController.setup);

/**
 * @swagger
 * /auth/2fa/setup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify and enable 2FA
 *     description: Verify the 2FA code from authenticator app and enable two-factor authentication
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
 *                 description: Six-digit code from authenticator app
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Two-factor authentication enabled"
 *       400:
 *         description: Invalid code
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/setup',isFullyAuthenticated, twoFactorMiddleware.verify, twoFactorController.setupVerify)

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify 2FA code during login
 *     description: Verify two-factor authentication code during login process
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
 *                 description: Six-digit code from authenticator app
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: 2FA code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code verified"
 *       400:
 *         description: Invalid code
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/verify', twoFactorMiddleware.verify, twoFactorController.verify)

/**
 * @swagger
 * /auth/2fa/disable:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Disable 2FA
 *     description: Disable two-factor authentication for the authenticated user
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
 *                 description: Six-digit code from authenticator app for verification
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Two-factor authentication disabled"
 *       400:
 *         description: Invalid code
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/disable', twoFactorMiddleware.verify, twoFactorController.disable)

export default router;