import {Router, Response, Request} from 'express';
import { isFullyAuthenticated } from "../../middlewares/auth/isFullyAuthenticated.js";
import {isAdmin} from "../../middlewares/auth/isAdmin.js";


const router: Router = Router();

/**
 * @swagger
 * /auth/verify/member:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify member authentication
 *     description: Verify that the authenticated user has completed all verification steps (email and ID validation)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Member verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member verified"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/member', isFullyAuthenticated, async (_req: Request, res: Response): Promise<void> =>
{
    res.status(200).send({ message: "Memberverified" });
})

/**
 * @swagger
 * /auth/verify/admin:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify admin access
 *     description: Verify that the authenticated user has admin privileges
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin privileges verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin verified"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/admin', isAdmin, async (_req: Request, res: Response): Promise<void> =>
{
    res.status(200).send({ message: "Admin verified" });
});

export default router;