import {Router} from "express";
import {typeDangerValidatorMiddleware} from "../../middlewares/validation/validation.js";
import * as typeDangerController from "../../controllers/type_danger/type_danger.js";

const router: Router = Router()

router.get('/', typeDangerValidatorMiddleware.typeDangers, typeDangerController.getTypeDangers);
router.get('/:id', typeDangerValidatorMiddleware.typeDanger, typeDangerController.getTypeDanger);
router.post('/', typeDangerValidatorMiddleware.createTypeDanger, typeDangerController.createTypeDanger);
router.put('/', typeDangerValidatorMiddleware.updateTypeDanger, typeDangerController.updateTypeDanger);
router.delete('/:id', typeDangerValidatorMiddleware.typeDanger, typeDangerController.deleteTypeDanger);

export default router;