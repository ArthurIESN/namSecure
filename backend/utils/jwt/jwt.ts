import jwt from 'jsonwebtoken';
import { JWTVerifiedFailedError } from "../../errors/JWT/JWTVerifiedFailedError.js";
import { JWTNotDefined } from "../../errors/JWT/JWTNotDefined.js";
import {IAuthUser} from "../../types/user/user";

export async function signJWT(authUser: IAuthUser, exp?: any): Promise<string>
{
    if(!process.env.JWT_SECRET)
    {
        throw new JWTNotDefined("JWT_SECRET is not defined");
    }

    const payload: object = { authUser, createdAt: new Date() };

    const expiration:  number  = exp ?? '30d';
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expiration});
}

export async function signResetPasswordJWT(email: string, userId: number): Promise<string>
{
    if(!process.env.JWT_SECRET)
    {
        throw new JWTNotDefined("JWT_SECRET is not defined");
    }

    const payload: object = { email, createdAt: new Date(), userId };

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '15m'});
}

export async function verifyJWT(token: string):  Promise<jwt.JwtPayload | string>
{
    if(!process.env.JWT_SECRET)
    {
        throw new JWTNotDefined("JWT_SECRET is not defined");
    }

    try
    {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error: any)
    {
        console.error(error);
        throw new JWTVerifiedFailedError("Failed to verify JWT");
    }
}