import { Router } from 'express';
import { memberValidatorMiddleware } from '@/middlewares/validation/validation';
import * as memberController from '@/controllers/member/member';
import passwordRouter from './password.js';
import {isAdmin} from "@/middlewares/auth/isAdmin";
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";

const router : Router = Router();

router.get('/', isAuthenticated, isAdmin,  memberValidatorMiddleware.members, memberController.getMembers);
router.get('/:id', memberValidatorMiddleware.member, memberController.getMember);
router.post('/', memberValidatorMiddleware.createMember, memberController.createMember);
router.put('/', memberValidatorMiddleware.updateMember, memberController.updateMember);
router.delete('/:id', memberValidatorMiddleware.member, memberController.deleteMember);

router.use('/password', passwordRouter);

export default router;