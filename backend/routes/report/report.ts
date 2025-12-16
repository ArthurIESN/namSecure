import {Router} from "express";
import {reportValidatorMiddleware} from "@/middlewares/validation/report/validation";
import * as reportController from "@/controllers/report/report";

const router: Router = Router()

router.get('/', reportValidatorMiddleware.reports, reportController.getReports);
router.get('/forUser',reportController.getReportsForUser);
router.get('/:id', reportValidatorMiddleware.report, reportController.getReport);
router.post('/', reportValidatorMiddleware.createReport, reportController.createReport);
router.put('/', reportValidatorMiddleware.updateReport, reportController.updateReport);
router.delete('/:id', reportValidatorMiddleware.report, reportController.deleteReport);

export default router;