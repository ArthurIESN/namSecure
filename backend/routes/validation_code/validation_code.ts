import {Router} from "express";
import * as validationCodeController from "@/controllers/validation_code/validation_code.js";
import { validationCodeValidatorMiddleware } from "@/middlewares/validation/validation_code/validation";


const router: Router = Router();

router.get("/", validationCodeValidatorMiddleware.validationCodes, validationCodeController.getValidationCodes);
router.get("/:id", validationCodeValidatorMiddleware.validationCode, validationCodeController.getValidationCode);
router.post("/", validationCodeValidatorMiddleware.createValidationCode, validationCodeController.createValidationCode);
router.put("/", validationCodeValidatorMiddleware.updateValidationCode, validationCodeController.updateValidationCode);
router.delete("/:id", validationCodeValidatorMiddleware.validationCode, validationCodeController.deleteValidationCode);


export default router;