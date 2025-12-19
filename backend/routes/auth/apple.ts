import {Router} from "express";
import {authValidationMiddleware} from "../../middlewares/validation/auth/validation";
import * as appleController from '../../controllers/auth/apple.js';

const router: Router = Router();

/**
 * @swagger
 * /auth/apple/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register with Apple
 *     description: Register a new user account using Apple identity token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identity_token:
 *                 type: string
 *                 description: Apple identity token (1-5000 characters)
 *               address:
 *                 type: string
 *                 description: User address (1-255 characters)
 *             required:
 *               - identity_token
 *               - address
 *     responses:
 *       201:
 *         description: User registered with Apple successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registered successfully"
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid token or missing fields
 *       409:
 *         description: Apple account already registered
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', authValidationMiddleware.appleRegister, appleController.register);

/**
 * @swagger
 * /auth/apple/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with Apple
 *     description: Authenticate a user using Apple identity token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identity_token:
 *                 type: string
 *                 description: Apple identity token (1-5000 characters)
 *             required:
 *               - identity_token
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid token
 *       404:
 *         description: Apple account not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', authValidationMiddleware.appleLogin, appleController.login);

export default router;