import { Router } from 'express';
import { memberValidatorMiddleware } from '@/middlewares/validation/member/validation';
import * as memberController from '@/controllers/member/member';
import * as profileController from '@/controllers/member/profile';
import passwordRouter from './password.js';
import {isAdmin} from "@/middlewares/auth/isAdmin";
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";
<<<<<<< HEAD
import {refreshToken} from "@/middlewares/auth/refreshToken";
=======
import { uploadProfilePhoto } from '@/middlewares/upload/profilePhoto';

>>>>>>> dorian

const router : Router = Router();

router.get('/', isAuthenticated, isAdmin,  memberValidatorMiddleware.members, memberController.getMembers);
router.get('/me', isAuthenticated, refreshToken, memberController.me);
router.get('/:id', memberValidatorMiddleware.member, memberController.getMember);
router.post('/', memberValidatorMiddleware.createMember, memberController.createMember);
router.put('/', memberValidatorMiddleware.updateMember, memberController.updateMember);
router.delete('/:id', memberValidatorMiddleware.member, memberController.deleteMember);
router.put(
    '/profile',
    isAuthenticated,
    uploadProfilePhoto.single('profilePhoto'),
    profileController.updateProfile
);
router.use('/password', passwordRouter);

export default router;