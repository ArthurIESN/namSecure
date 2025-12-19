import {Router} from 'express';
import * as loginController from '@/controllers/auth/login';
import {loginValidatorMiddleware} from "@/middlewares/validation/auth/validation";

const router: Router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticate a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password (1-255 characters)
 *             required:
 *               - email
 *               - password
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
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */
router.post('/', loginValidatorMiddleware.login, loginController.login);

export default router;