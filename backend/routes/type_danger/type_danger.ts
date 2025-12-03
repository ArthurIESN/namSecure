import {Router} from "express";
import {typeDangerValidatorMiddleware} from "@/middlewares/validation/validation";
import * as typeDangerController from "@/controllers/type_danger/type_danger";

const router: Router = Router()

router.get('/', typeDangerValidatorMiddleware.typeDangers, typeDangerController.getTypeDangers);
router.get('/used', typeDangerValidatorMiddleware.typeDangersUsed, typeDangerController.getTypeDangersUsed);
router.get('/:id', typeDangerValidatorMiddleware.typeDanger, typeDangerController.getTypeDanger);
router.post('/', typeDangerValidatorMiddleware.createTypeDanger, typeDangerController.createTypeDanger);
router.put('/', typeDangerValidatorMiddleware.updateTypeDanger, typeDangerController.updateTypeDanger);
router.delete('/:id', typeDangerValidatorMiddleware.typeDanger, typeDangerController.deleteTypeDanger);

export default router;