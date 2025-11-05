import { Router, Response, Request } from 'express';

import verifyRouter from './verify.js';
import loginRouter from './login.js';
import registerRouter from './register.js';
import {isAuthenticated} from "../../middlewares/auth/isAuthenticated.js";
import {clearTokenCookie} from "../../utils/cookie/cookie.js";
import {IAuthMember, IAuthUser} from "../../types/user/user";
import {IAuthUserInfo} from "@namSecure/shared/types/auth/auth";

const authRouter: Router = Router();


authRouter.use('/verify', isAuthenticated, verifyRouter);
authRouter.use('/login', loginRouter);
authRouter.use('/register', registerRouter);

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

authRouter.get('/me', isAuthenticated, async (req: Request, res: Response) =>
{
    try
    {
        const user: IAuthUser = req.user as IAuthUser;
        const member: IAuthMember = req.member as IAuthMember;

        const userInfo: IAuthUserInfo =
            {
                email: user.email,
                emailVerified: member.email_checked,
                idVerified: member.id_checked,
            }

        res.status(200).json(userInfo);
    }
    catch (error: any)
    {
        res.status(500).json({ error: 'Internal server error' });
    }

});

export default authRouter;