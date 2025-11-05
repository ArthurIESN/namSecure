import {Router} from "express";
import {reportValidatorMiddleware} from "../../middlewares/validation/validation.js";
import * as reportController from "../../controllers/report/report.js";

const router: Router = Router()

router.get('/', reportValidatorMiddleware.reports, reportController.getReports);

export default router;