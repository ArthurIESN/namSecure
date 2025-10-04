import { Router } from 'express';
import memberRoleRoutes from './member_role/member_role.js';
const router = Router();
router.use('/memberRole', memberRoleRoutes);
router.use((req, res) => {
    console.error(`Bad URL: ${req.path}`);
    res.status(404).send("Not Found");
});
export default router;
//# sourceMappingURL=router.js.map