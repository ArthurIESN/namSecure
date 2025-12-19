import {NextFunction, Request, Response} from "express";
import * as typeDangerValidator from "@/middlewares/validation/type_danger/type_danger";

export const typeDangerValidatorMiddleware = {
    createTypeDanger: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await typeDangerValidator.createTypeDanger.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    typeDanger: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await typeDangerValidator.typeDanger.validate(req.params);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    typeDangers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await typeDangerValidator.typeDangers.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    typeDangersUsed: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await typeDangerValidator.typeDangersUsed.validate(req.query);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    updateTypeDanger: async (req : Request, res : Response, next : NextFunction) =>
    {
        try
        {
            req.validated = await typeDangerValidator.updateTypeDanger.validate(req.body);
            next();
        }
        catch(error: any)
        {
            res.status(400).send({error: error.messages[0].message});
        }
    }
};