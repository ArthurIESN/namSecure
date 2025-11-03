import jwt from 'jsonwebtoken';
import { JWTVerifiedFailedError } from "../../errors/JWT/JWTVerifiedFailedError.js";
import { JWTNotDefined } from "../../errors/JWT/JWTNotDefined.js";

export async function signJWT(data: object): Promise<string>
{
    if(!process.env.JWT_SECRET)
    {
        throw new JWTNotDefined("JWT_SECRET is not defined");
    }

    const payload: object = { data, createdAt: new Date() };

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'});
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