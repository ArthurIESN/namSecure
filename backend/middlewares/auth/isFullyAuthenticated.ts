import {Request, Response, NextFunction} from "express";
import { verifyJWT } from "../../utils/jwt/jwt.js";
import { JwtPayload } from "jsonwebtoken";
import databasePrisma from "../../database/databasePrisma.js";

export const isFullyAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const token: string = req.headers?.authorization?.split(' ')[1] || "";

    if(!token)
    {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    try
    {
        const decoded: string | JwtPayload = verifyJWT(token);
        req.user = (decoded as any).data;

        const user = await databasePrisma.member.findUnique({where: {id: req.user!.id}});

        if(!user)
        {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        if(!user.email_checked || !user.id_checked)
        {
            res.status(403).json({error: "Forbidden: Incomplete authentication"});
            return;
        }

        next();
    }
    catch (error : any)
    {
        // @todo check if the error is a 400 or a 500
        console.error("JWT verification failed:", error);
        res.status(401).json({error: "Unauthorized"});
    }
}