import { Router } from 'express';

import loginRouter from './login.js';
import registerRouter from './register.js';

const authRouter: Router = Router();

authRouter.use('/login', loginRouter);
authRouter.use('/register', registerRouter);

export default authRouter;