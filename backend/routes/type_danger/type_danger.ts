import {Router} from "express";
import {typeDangerValidatorMiddleware} from "../../middlewares/validation/validation.js";
import * as typeDangerController from "../../controllers/type_danger/type_danger.js";

const router: Router = Router()

router.get('/', typeDangerValidatorMiddleware.typeDangers, typeDangerController.getTypeDangers);

export default router;