import './messageProvider.js';

import { NextFunction, Request, Response} from "express";
import * as memberRoleValidator from './member_role.js';
import * as memberValidator from './member.js';
import * as typeDangerValidator from './type_danger.js';
import * as reportValidator from './report.js';

export const memberValidatorMiddleware =
{
    createMember: async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.validated = await memberValidator.createMember.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    member: async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.validated = await memberValidator.member.validate(req.params);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    members: async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.validated = await memberValidator.members.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    updateMember: async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.validated = await memberValidator.updateMember.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    passwordChange: async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.validated = await memberValidator.passwordChange.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    passwordReset: async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.validated = await memberValidator.passwordReset.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    }
};

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

export const typeDangerValidatorMiddleware = {
    typeDangers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await typeDangerValidator.typeDangers.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    }
};

export const reportValidatorMiddleware = {
    reports: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await reportValidator.reports.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    }
};