import { Router } from 'express';
import { mem as memberRoleValidation} from '../../middlewares/validation/member_role.js';
import * as memberRoleController from '../../controllers/member_role/member_role.js';

const router: Router = Router();

router.get('/', memberRoleController.getMemberRoles);
router.get('/:id', memberRoleController.getMemberRole);
router.post('/', memberRoleValidation.memberRole, memberRoleController.createMemberRole);
router.patch('/', memberRoleController.updateMemberRole);
router.delete('/:id', memberRoleController.deleteMemberRole);


export default router;
