import Router from 'express-promise-router';
import { Router as ExpressRouter } from 'express';
import * as memberController from '../../controllers/member/member.js';

const router : ExpressRouter = Router();

router.get('/', memberController.getMembers);
router.get('/:id', memberController.getMember);
router.post('/', memberController.createMember);

export default router;