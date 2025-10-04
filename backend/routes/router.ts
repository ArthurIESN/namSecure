import { Request, Response } from 'express';
import { Router } from 'express';

import memberRoleRoutes from './member_role/member_role.js';


const router : Router = Router();

router.use('/memberRole', memberRoleRoutes);



// default error @todo handle this in a better way

router.use((req: Request, res: Response) =>
{
    console.error(`Bad URL: ${req.path}`);
    res.status(404).send("Not Found");
});

export default router;
