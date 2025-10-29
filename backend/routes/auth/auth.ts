import { Router } from 'express';

import verifyRouter from './verify.js';
import loginRouter from './login.js';
import registerRouter from './register.js';

const authRouter: Router = Router();


authRouter.use('/verify', verifyRouter);
authRouter.use('/login', loginRouter);
authRouter.use('/register', registerRouter);

export default authRouter;