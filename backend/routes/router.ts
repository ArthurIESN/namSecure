import { Request, Response } from 'express';
import { Router } from 'express';

import memberRouter from './member/member.js';
import memberRoleRouter from './member_role/member_role.js';
import teamRouter from './team/team.js';
import authRouter from './auth/auth.js';
import typeDangerRouter from './type_danger/type_danger.js';
import reportRouter from './report/report.js';
import twoFactorRouter from './twoFactor/twoFactor.js';

//@todo move this in types folder
interface IRouter
{
    route: string,
    router: Router,
}

const routers: IRouter[] =
    [
        { route: '/member', router: memberRouter },
        { route: '/memberRole', router: memberRoleRouter },
        { route: '/auth', router: authRouter },
        { route: '/typeDanger', router: typeDangerRouter },
        { route: '/report', router: reportRouter },
        { route: '/team', router: teamRouter },
        { route: '/twoFactor', router: twoFactorRouter },
    ];


const router : Router = Router();

routers.forEach(r => router.use(r.route, r.router));


// default error @todo handle this in a better way
router.use(Error404);

function Error404(req: Request, res: Response) : void
{
    console.error(`Bad URL: ${req.path}`);
    res.status(404).json({ error: "Bad URL"} );
}

export default router;
