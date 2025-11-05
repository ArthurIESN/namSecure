import {Router} from "express";
import {reportValidatorMiddleware} from "../../middlewares/validation/validation.js";
import * as reportController from "../../controllers/report/report.js";

const router: Router = Router()

router.get('/', reportValidatorMiddleware.reports, reportController.getReports);
router.get('/:id', reportValidatorMiddleware.report, reportController.getReport);
router.post('/', reportValidatorMiddleware.createReport, reportController.createReport);
router.put('/', reportValidatorMiddleware.updateReport, reportController.updateReport);
router.delete('/:id', reportValidatorMiddleware.report, reportController.deleteReport);

export default router;