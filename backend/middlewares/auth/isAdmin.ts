import {Request, Response, NextFunction} from "express";
import databasePrisma from "../../database/databasePrisma.js";

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    try
    {
        const user =  await databasePrisma.member.findUnique(
        {
            where: {id: req.user!.id},
            include: {member_role: true}
        });

        if(!user || !user.member_role)
        {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        if(user.member_role.name !== "admin")
        {
            res.status(401).json({error: "Unauthorized"});
        }
        next();
    }
    catch (error : any)
    {
        console.error("Middleware error", error);
        res.status(500).json({error: "Internal server error"});
    }
}