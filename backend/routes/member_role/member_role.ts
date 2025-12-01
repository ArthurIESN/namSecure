import { Router } from 'express';
import { memberRoleValidatorMiddleware } from "@/middlewares/validation/validation"
import * as memberRoleController from '@/controllers/member_role/member_role.js';

const router: Router = Router();

router.get('/', memberRoleValidatorMiddleware.memberRoles, memberRoleController.getMemberRoles);
router.get('/:id', memberRoleValidatorMiddleware.memberRole, memberRoleController.getMemberRole);
router.post('/', memberRoleValidatorMiddleware.createMemberRole, memberRoleController.createMemberRole);
router.put('/', memberRoleValidatorMiddleware.updateMemberRole, memberRoleController.updateMemberRole);
router.delete('/:id', memberRoleValidatorMiddleware.memberRole, memberRoleController.deleteMemberRole);

export default router;
