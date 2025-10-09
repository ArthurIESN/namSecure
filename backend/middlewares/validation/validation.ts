import * as memberRoleValidation from './memberRole.js';
import {NextFunction} from "express";

export const memberRoleValidationMiddleware =
    {
        memberRole: async (req : Request, res : Response, next : NextFunction) =>
        {
            try
            {
                req.val = await memberRoleValidation.memberRole(req.body);
                next();
            }

        }
    }