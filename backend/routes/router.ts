import { Request, Response } from 'express';
import { Router } from 'express';
import { IRouter } from '@/types/router/router';

import memberRouter from '@/routes/member/member';
import memberRoleRouter from '@/routes/member_role/member_role';
import teamRouter from '@/routes/team/team';
import teamMemberRouter from '@/routes/team_member/team_member';
import authRouter from '@/routes/auth/auth.js';
import typeDangerRouter from '@/routes/type_danger/type_danger';
import validationCodeRouter from '@/routes/validation_code/validation_code';
import reportRouter from '@/routes/report/report';
import twoFactorRouter from '@/routes/twoFactor/twoFactor';
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";
import {isAdmin} from "@/middlewares/auth/isAdmin";


const routers: IRouter[] =
[
    { route: '/member', router: memberRouter },
    { route: '/memberRole', router: memberRoleRouter, middleware: [isAuthenticated, isAdmin] }, //@todo change this to member-role
    { route: '/auth', router: authRouter },
    { route: '/typeDanger', router: typeDangerRouter, middleware: [isAuthenticated] }, //@todo change this to type-danger
    { route: '/validation-code', router: validationCodeRouter },
    { route: '/report', router: reportRouter, middleware: [isAuthenticated] },
    { route: '/team', router: teamRouter},
    { route: '/team-member', router: teamMemberRouter, middleware: [isAuthenticated,isAdmin] },
    { route: '/two-factor', router: twoFactorRouter, middleware: [isAuthenticated, isAdmin] },
];

const appRouter : Router = Router();

routers.forEach(router =>
{
    const middleware = router.middleware ?? [];
    appRouter.use(router.route, ...middleware, router.router);
});

// default error @todo handle this in a better way
appRouter.use(Error404);

function Error404(req: Request, res: Response) : void
{
    console.error(`Bad URL: ${req.path}`);
    res.status(404).json({ error: "Bad URL"} );
}

export default appRouter;
