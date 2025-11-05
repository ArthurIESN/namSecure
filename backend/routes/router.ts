import { Request, Response } from 'express';
import { Router } from 'express';

import memberRouter from './member/member.js';
import memberRoleRouter from './member_role/member_role.js';

import authRouter from './auth/auth.js';

import typeDangerRouter from './type_danger/type_danger.js';
import reportRouter from './report/report.js';


const router : Router = Router();

router.use('/member', memberRouter);
router.use('/memberRole', memberRoleRouter);

router.use('/auth', authRouter);

router.use('/typeDanger', typeDangerRouter);
router.use('/report', reportRouter);


// default error @todo handle this in a better way

router.use(Error404);

function Error404(req: Request, res: Response) : void
{
    console.error(`Bad URL: ${req.path}`);
    res.status(404).json({ error: "Bad URL"} );
}

export default router;
