import {Response, Request, NextFunction} from "express";
import databasePrisma from "../../database/databasePrisma.js";
export const emailValidationState = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    try
    {
        const user = await databasePrisma.member.findUnique({where: {id: req.user!.id}});

        if(!user)
        {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        if(user.email_checked)
        {
            res.status(403).json({error: "Forbidden: Email is already validated"});
            return;
        }

        next();
    }
    catch (error : any)
    {
        console.error("Middleware error", error);
        res.status(500).json({error: "Internal server error"});
    }
}