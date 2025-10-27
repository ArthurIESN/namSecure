import './messageProvider.js';

import { NextFunction, Request, Response} from "express";
import * as memberRoleValidator from './member_role.js';

export const memberRoleValidatorMiddleware =
{
    createMemberRole: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await memberRoleValidator.createMemberRole.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    memberRole: async (req : Request, res : Response, next : NextFunction) =>
    {
      try
      {
            req.validated = await memberRoleValidator.memberRole.validate(req.params);
            next();
      }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    memberRoles: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await memberRoleValidator.memberRoles.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    updateMemberRole: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await memberRoleValidator.updateMemberRole.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    }
}
