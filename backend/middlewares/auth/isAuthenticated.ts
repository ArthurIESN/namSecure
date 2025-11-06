import {Request, Response, NextFunction} from "express";
import {signJWT, verifyJWT} from "../../utils/jwt/jwt.js";
import {setTokenCookie} from "../../utils/cookie/cookie.js";
import databasePrisma from "../../database/databasePrisma.js";
import { IAuthMember } from "../../types/user/user.js";
import {JwtPayload} from "jsonwebtoken";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const token: string = req.cookies?.token || req.headers?.authorization?.split(' ')[1] || "";

    if(token === "")
    {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    try
    {
        const decoded: string | JwtPayload = await verifyJWT(token);
        req.user = (decoded as any).data; // assuming the payload has a 'data' field @TODO type this properly

        if(!req.user)
        {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        // refresh token if expires in less than  5 days
        const exp: number = (decoded as any).exp;
        const now: number = Math.floor(Date.now() / 1000);
        const fiveDaysInSeconds: number = 5 * 24 * 60 * 60;

        if (exp - now < fiveDaysInSeconds)
        {
            const newToken: string = await signJWT(req.user as object);
            setTokenCookie(res, newToken);
        }

        const member: IAuthMember | null = await databasePrisma.member.findUnique(
        {
            where:
            {
                id: req.user.id
            },
            select:
                {
                    email_checked: true,
                    id_checked: true,
                    password_last_update: true,
                    member_2fa:
                    {
                        select:
                            {
                                is_enabled: true
                            }
                    },
                    member_role:
                    {
                        select:
                            {
                                name: true
                            }
                    }
                }
        });

        if(!member)
        {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        req.member = member;

        if(req.member.password_last_update > new Date((decoded as any).createdAt * 1000))
        {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        next();
    }
    catch (error : any)
    {
        console.error("JWT verification failed:", error);
        res.status(401).json({error: "Unauthorized"});
    }
}