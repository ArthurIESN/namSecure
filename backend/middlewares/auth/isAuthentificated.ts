import {Request, Response, NextFunction} from "express";
import { verifyJWT } from "../../utils/jwt/jwt.js";

export const isAuthentificated = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const token: string = req.headers?.authorization?.split(' ')[1] || "";

    if(!token)
    {
        res.status(401).json({error: "Unauthorized"});
    }

    try
    {
        const decoded = verifyJWT(token);
        req.user = (decoded as any).data; // assuming the payload has a 'data' field @TODO type this properly
        next();
    }
    catch (error : any)
    {
        console.error("JWT verification failed:", error);
        res.status(401).json({error: "Unauthorized"});
    }
}