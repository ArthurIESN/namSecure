import { Router } from 'express';
import {memberValidatorMiddleware} from "@/middlewares/validation/member/validation";
import {isFullyAuthenticated} from "@/middlewares/auth/isFullyAuthenticated";
import * as passwordController from '@/controllers/member/password.js';
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";


const router: Router = Router();

/**
 * @swagger
 * /member/password/reset:
 *   post:
 *     tags:
 *       - Member
 *     summary: Reset member password
 *     description: Send a password reset email to a member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the member
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset email sent"
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Internal Server Error
 */
router.post('/reset', memberValidatorMiddleware.passwordReset, passwordController.reset);

/**
 * @swagger
 * /member/password/change:
 *   post:
 *     tags:
 *       - Member
 *     summary: Change member password
 *     description: Change the password for an authenticated member
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
 *               current_password:
 *                 type: string
 *                 description: Current password (1-255 characters)
 *               new_password:
 *                 type: string
 *                 description: New password (1-255 characters)
 *               new_password_confirmation:
 *                 type: string
 *                 description: New password confirmation (must match new_password)
 *             required:
 *               - current_password
 *               - new_password
 *               - new_password_confirmation
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid request data or passwords do not match
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/change', memberValidatorMiddleware.passwordChange, isAuthenticated, isFullyAuthenticated, passwordController.change);

/**
 * @swagger
 * /member/password/verify:
 *   post:
 *     tags:
 *       - Member
 *     summary: Verify member password
 *     description: Verify the current password for an authenticated member
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
 *               password:
 *                 type: string
 *                 description: Password to verify (1-255 characters)
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password verified"
 *       400:
 *         description: Invalid password
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/verify', memberValidatorMiddleware.passwordVerify, isAuthenticated, isFullyAuthenticated, passwordController.verify);

export default router;