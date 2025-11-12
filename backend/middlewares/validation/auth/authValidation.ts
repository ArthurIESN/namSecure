import "@/middlewares/validation/messageProvider";

import { File } from 'node:buffer';
import * as emailValidationValidator from "@/middlewares/validation/auth/emailValidation";
import * as registerValidator from "@/middlewares/validation/auth/register";
import * as loginValidator from "@/middlewares/validation/auth/login";
import * as idValidationValidator from "@/middlewares/validation/auth/idValidation";
import * as appleValidation from "@/middlewares/validation/auth/apple";
import * as twoFactorValidation from "@/middlewares/validation/auth/twoFactor";
import { Request, Response, NextFunction } from "express";


export const authValidationMiddleware =
    {
        appleRegister: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await appleValidation.appleRegister.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        },

        appleLogin: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await appleValidation.appleLogin.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        }

};

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
        emailValidation: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                req.validated = await emailValidationValidator.emailValidation.validate(req.body);
                next();
            }
            catch (error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        }
    }

    export const idValidationMiddleware =
    {
        idValidation: async (req: Request, res: Response, next: NextFunction): Promise<void> =>
        {
            try
            {
                // @ts-ignore
                if(!req.files!.front_id_card || !req.files!.back_id_card || req.files!.front_id_card.length === 0 || req.files!.back_id_card.length === 0)
                {
                   res.status(400).send({ error: "Both front and back ID card images are required." });
                     return;
                }

                // @ts-ignore
                const frontIdCardMulter = req.files!.front_id_card[0];
                // @ts-ignore
                const backIdCardMulter = req.files!.back_id_card[0];

                const front_file = new File
                (
                    [frontIdCardMulter.buffer],
                    frontIdCardMulter.originalname,
                    { type: frontIdCardMulter.mimetype }
                );

                const back_file = new File
                (
                    [backIdCardMulter.buffer],
                    backIdCardMulter.originalname,
                    { type: backIdCardMulter.mimetype }
                );

                const id_files =
                {
                    front_id_card: front_file,
                    back_id_card: back_file
                };

                req.validated = await idValidationValidator.idValidation.validate(id_files);
                next();
            }
            catch (error: any)
            {
                console.error(error);
                res.status(400).send({ error: error.messages[0].message });
            }
        }
    }

    export const twoFactorMiddleware =
    {
        setup: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await twoFactorValidation.setup.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        },

        verify: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await twoFactorValidation.verify.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({ error: error.messages[0].message });
            }
        }
    }
