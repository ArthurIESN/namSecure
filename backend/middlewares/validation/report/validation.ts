import {NextFunction, Request, Response} from "express";
import * as reportValidator from "@/middlewares/validation/report/report";
import {roleBasedBodyValidation} from "@/middlewares/validation/authorization/roleBasedValidation";

export const reportValidatorMiddleware = {

    report: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await reportValidator.report.validate(req.params);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    reports: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await reportValidator.reports.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    updateReport: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await reportValidator.updateReport.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    createReport: roleBasedBodyValidation({
        adminSchema: reportValidator.createReportAdmin,
        userSchema: reportValidator.createReportUser,
    }),

};