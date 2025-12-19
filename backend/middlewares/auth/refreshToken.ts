import {NextFunction, Request, Response} from "express";
import {JwtPayload} from "jsonwebtoken";
import {signJWT, verifyJWT} from "@/utils/jwt/jwt";
import {IAuthUser} from "@/types/user/user";
import {setTokenCookie} from "@/utils/cookie/cookie";

export const refreshToken = async (req: Request, res: Response, next: NextFunction) =>
{
    const token: string = req.cookies?.token || req.headers?.authorization?.split(' ')[1] || "";
    const decoded: string | JwtPayload = await verifyJWT(token);
    const user: IAuthUser = req.user as IAuthUser;

    // refresh token if expires in less than  5 days
    const exp: number = (decoded as any).exp;
    const now: number = Math.floor(Date.now() / 1000);
    const fiveDaysInSeconds: number = 5 * 24 * 60 * 60;

    if (exp - now < fiveDaysInSeconds)
    {
        const newAuthUser: IAuthUser =
            {
                id: user.id,
                email: user.email,
                twoFactorVerified: false // 2FA needs to be re-verified after token refresh
            }
        const newToken: string = await signJWT(newAuthUser);
        setTokenCookie(res, newToken);
    }

    next();
}