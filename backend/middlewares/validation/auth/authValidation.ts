import "../messageProvider.js";
import * as emailValidationValidator from './emailValidation.js';
import * as registerValidator from './register.js';
import * as loginValidator from './login.js';
import { Request, Response, NextFunction } from "express";

export const loginValidatorMiddleware =
    {
        login: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await loginValidator.login.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        }
    }

export const registerValidatorMiddleware =
    {
        register: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await registerValidator.register.validate(req.body);
                next();
            }
            catch(error: any)
            {
                console.error(error);
                res.status(400).send({error: error.messages[0].message}); // Send only the first error message
            }
        }
    }


export const emailValidationMiddleware =
    {
        emailVerify: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                req.validated = await emailValidationValidator.emailVerify.validate(req.body);
                next();
            }
            catch (error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        }
    }