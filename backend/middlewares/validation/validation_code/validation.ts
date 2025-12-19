import { NextFunction, Request, Response} from "express";
import * as validationCodeValidator from "@/middlewares/validation/validation_code/validation_code";

export const validationCodeValidatorMiddleware =
    {
        validationCodes: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                req.validated = await validationCodeValidator.validationCodes.validate(req.query);
                next();
            }
            catch (error: any)
            {
                res.status(400).send({error: error.messages[0].message});
            }
        },

        validationCode: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                req.validated = await validationCodeValidator.validationCode.validate(req.params);
                next();
            }
            catch (error: any)
            {
                res.status(400).send({error: error.messages[0].message});
            }
        },

        createValidationCode: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                req.validated = await validationCodeValidator.createValidationCode.validate(req.body);
                next();
            }
            catch (error: any)
            {
                res.status(400).send({error: error.messages[0].message});
            }
        },

        updateValidationCode: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                req.validated = await validationCodeValidator.updateValidationCode.validate(req.body);
                next();
            }
            catch (error: any)
            {
                res.status(400).send({error: error.messages[0].message});
            }
        }
    }
