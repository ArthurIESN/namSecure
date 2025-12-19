import {Router} from "express";
import { twoFactorValidationMiddleware } from "@/middlewares/validation/twoFactor/validation";
import * as twoFactorController from '@/controllers/twoFactor/twoFactor';

const router: Router = Router();

/**
 * @swagger
 * /two-factor:
 *   get:
 *     tags:
 *       - Two-Factor Authentication
 *     summary: Get all two-factor authentication entries
 *     description: Retrieve a paginated list of all 2FA configurations with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of entries to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of entries to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TwoFactorList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/', twoFactorValidationMiddleware.twoFactors, twoFactorController.getTwoFactors);

/**
 * @swagger
 * /two-factor/{id}:
 *   get:
 *     tags:
 *       - Two-Factor Authentication
 *     summary: Get a specific 2FA configuration
 *     description: Retrieve a single 2FA configuration by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 2FA configuration ID
 *     responses:
 *       200:
 *         description: 2FA configuration found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TwoFactor'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Two-Factor Authentication entry not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', twoFactorValidationMiddleware.twoFactor, twoFactorController.getTwoFactor);

/**
 * @swagger
 * /two-factor:
 *   post:
 *     tags:
 *       - Two-Factor Authentication
 *     summary: Create a 2FA configuration
 *     description: Create a new two-factor authentication configuration (requires admin)
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
 *               secret_key:
 *                 type: string
 *                 description: Secret key for 2FA (16-500 characters)
 *               is_enabled:
 *                 type: boolean
 *                 description: Whether this 2FA configuration is enabled
 *             required:
 *               - secret_key
 *               - is_enabled
 *     responses:
 *       201:
 *         description: 2FA configuration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Two-Factor Authentication entry created successfully"
 *       400:
 *         description: Missing required fields or invalid field format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.post('/', twoFactorValidationMiddleware.createTwoFactor, twoFactorController.createTwoFactor);

/**
 * @swagger
 * /two-factor:
 *   put:
 *     tags:
 *       - Two-Factor Authentication
 *     summary: Update a 2FA configuration
 *     description: Update an existing two-factor authentication configuration (requires admin)
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
 *               id:
 *                 type: number
 *                 description: 2FA configuration ID to update
 *               secret_key:
 *                 type: string
 *                 description: Secret key for 2FA (16-500 characters, optional)
 *               is_enabled:
 *                 type: boolean
 *                 description: Whether this 2FA configuration is enabled
 *             required:
 *               - id
 *               - is_enabled
 *     responses:
 *       200:
 *         description: 2FA configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Two-Factor Authentication entry updated successfully"
 *       400:
 *         description: Missing required fields or invalid field format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.put('/', twoFactorValidationMiddleware.updateTwoFactor, twoFactorController.updateTwoFactor);

/**
 * @swagger
 * /two-factor/{id}:
 *   delete:
 *     tags:
 *       - Two-Factor Authentication
 *     summary: Delete a 2FA configuration
 *     description: Delete a two-factor authentication configuration by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 2FA configuration ID to delete
 *     responses:
 *       200:
 *         description: 2FA configuration deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Two-Factor Authentication entry deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', twoFactorValidationMiddleware.twoFactor, twoFactorController.deleteTwoFactor);

export default router;