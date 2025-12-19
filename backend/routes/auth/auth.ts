import { Router, Response, Request } from 'express';

import verifyRouter from './verify.js';
import loginRouter from './login.js';
import registerRouter from './register.js';
import appleRouter from './apple.js';
import twoFactorRouter from './twoFactor.js';
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";
import {clearTokenCookie} from "@/utils/cookie/cookie";

const authRouter: Router = Router();

authRouter.use('/verify', isAuthenticated, verifyRouter);
authRouter.use('/login', loginRouter);
authRouter.use('/register', registerRouter);
authRouter.use('/apple', appleRouter);
authRouter.use('/2fa', isAuthenticated, twoFactorRouter);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Clear authentication cookies and logout the user
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       500:
 *         description: Internal Server Error
 */
//@todo move in controller
authRouter.post('/logout', async (_req: Request, res: Response) => {
    try
    {
        clearTokenCookie(res);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error)
    {
        res.status(500).json({ error: 'Failed to logout' });
    }
});

export default authRouter;