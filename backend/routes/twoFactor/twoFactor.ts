import {Router} from "express";

const router: Router = Router();

router.get('/');
router.get('/:id');
router.post('/');
router.put('/');
router.delete('/:id');

export default router;