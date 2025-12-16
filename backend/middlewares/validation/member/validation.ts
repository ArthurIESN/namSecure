import {NextFunction, Request, Response} from "express";
import * as memberValidator from "@/middlewares/validation/member/member";

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
        },

        passwordVerify: async (req: Request, res: Response, next: NextFunction) =>
        {
            try
            {
                req.validated = await memberValidator.passwordVerify.validate(req.body);
                next();
            }
            catch(error: any)
            {
                res.status(400).send({error: error.messages[0].message});
            }
        }
    };