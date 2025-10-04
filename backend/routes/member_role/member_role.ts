import Router from 'express-promise-router';
import { Router as ExpressRouter } from 'express';
import * as memberRoleController from '../../controllers/member_role/member_role.js';

const router: ExpressRouter = Router();

router.get('/', memberRoleController.getMemberRoles);
router.get('/:id', memberRoleController.getMemberRole);
router.post('/', memberRoleController.createMemberRole);
router.patch('/', memberRoleController.updateMemberRole);
router.delete('/:id', memberRoleController.deleteMemberRole);


export default router;
