import './messageProvider.js';
import * as memberRoleValidator from './member_role.js';
import * as registerValidator from './auth/register.js';
import { NextFunction, Request, Response} from "express";

export const memberRoleValidatorMiddleware =
    {
        memberRole: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.validated = await memberRoleValidator.memberRole.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({error: error.message});
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

