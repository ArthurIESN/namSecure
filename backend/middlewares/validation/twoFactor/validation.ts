import '@/middlewares/validation/messageProvider';

import { NextFunction, Request, Response} from "express";
import * as twoFactorValidator from "@/middlewares/validation/twoFactor/twoFactor";

export const twoFactorValidationMiddleware =
{
    twoFactors: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    {
        try
        {
            req.validated = await twoFactorValidator.twoFactors.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    twoFactor: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    {
        try
        {
            req.validated = await twoFactorValidator.twoFactor.validate(req.params);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    createTwoFactor: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    {
        try
        {
            req.validated = await twoFactorValidator.createTwoFactor.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    updateTwoFactor: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    {
        try
        {
            req.validated = await twoFactorValidator.updateTwoFactor.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    }
}
