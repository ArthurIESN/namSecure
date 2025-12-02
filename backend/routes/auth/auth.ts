import { Router, Response, Request } from 'express';

import verifyRouter from './verify.js';
import loginRouter from './login.js';
import registerRouter from './register.js';
import appleRouter from './apple.js';
import twoFactorRouter from './twoFactor.js';
import {isAuthenticated} from "../../middlewares/auth/isAuthenticated.js";
import {clearTokenCookie} from "../../utils/cookie/cookie.js";
import {IAuthMember, IAuthUser} from "../../types/user/user.js";
import {IAuthUserInfo} from '@namSecure/shared/types/auth/auth';

const authRouter: Router = Router();

authRouter.use('/verify', isAuthenticated, verifyRouter);
authRouter.use('/login', loginRouter);
authRouter.use('/register', registerRouter);
authRouter.use('/apple', appleRouter);
authRouter.use('/2fa', isAuthenticated, twoFactorRouter);

//@todo move in controller
authRouter.post('/logout', isAuthenticated, async (_req: Request, res: Response) => {
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