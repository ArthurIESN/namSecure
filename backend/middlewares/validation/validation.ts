// import './messageProvider.js'; @todo check if this import is needed
import * as memberRoleValidator from './member_role.js';

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
