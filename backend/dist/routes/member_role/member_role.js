import Router from 'express-promise-router';
import * as memberRoleController from '../../controllers/member_role/member_role.js';
const router = Router();
router.get('/', memberRoleController.getMemberRoles);
router.get('/:id', memberRoleController.getMemberRole);
router.post('/', memberRoleController.createMemberRole);
router.put('/', memberRoleController.updateMemberRole);
router.delete('/:id', memberRoleController.deleteMemberRole);
export default router;
//# sourceMappingURL=member_role.js.map