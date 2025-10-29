import { Router } from 'express';
import { memberValidatorMiddleware } from '../../middlewares/validation/validation.js';
import * as memberController from '../../controllers/member/member.js';

const router : Router = Router();

router.get('/', memberValidatorMiddleware.members, memberController.getMembers);
router.get('/:id', memberValidatorMiddleware.member, memberController.getMember);
router.post('/', memberValidatorMiddleware.createMember, memberController.createMember);
//router.patch('/', memberValidatorMiddleware.updateMember, memberController.updateMember);
router.delete('/:id', memberValidatorMiddleware.member, memberController.deleteMember);

export default router;