import {Router, Response, Request} from 'express';
import { isFullyAuthenticated } from "../../middlewares/auth/isFullyAuthenticated.js";
import {isAdmin} from "../../middlewares/auth/isAdmin.js";


const router: Router = Router();
router.get('/member', isFullyAuthenticated, async (_req: Request, res: Response): Promise<void> =>
{
    res.status(200).send({ message: "Memberverified" });
})

router.get('/admin', isAdmin, async (_req: Request, res: Response): Promise<void> =>
{
    res.status(200).send({ message: "Admin verified" });
});

export default router;