import { Router } from 'express';
import { isAuthenticated } from "../../middlewares/auth/isAuthenticated.js";
import { emailValidationState } from "../../middlewares/auth/emailValidationState.js";
import { idValidationState } from "../../middlewares/auth/idValidationState.js";
import { registerValidatorMiddleware } from "../../middlewares/validation/auth/validation";
import * as registerController from '../../controllers/auth/register.js';
import emailValidationRouter from './emailValidation.js';
import idValidationRouter from './idValidation.js';


const router: Router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     description: Create a new user account with email, password, and address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address (max 100 characters)
 *               password:
 *                 type: string
 *                 description: User password (1-255 characters)
 *               password_confirmation:
 *                 type: string
 *                 description: Password confirmation (must match password)
 *               address:
 *                 type: string
 *                 description: User address (1-255 characters)
 *             required:
 *               - email
 *               - password
 *               - password_confirmation
 *               - address
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 id:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Invalid request data or passwords do not match
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/', registerValidatorMiddleware.register, registerController.register);

router.use('/email-validation', isAuthenticated, emailValidationState, emailValidationRouter);
router.use('/id-validation', isAuthenticated, idValidationState, idValidationRouter);

export default router;