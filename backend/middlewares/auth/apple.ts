import jwt, {Jwt, JwtPayload} from "jsonwebtoken";
import JwksClient from "jwks-rsa";
import {Request, Response, NextFunction} from "express";

const client: any = new (JwksClient as any)
({
    jwksUri: 'https://appleid.apple.com/auth/keys'
});

export const  apple = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    try
    {
        const { identity_token }: { identity_token?: string } = req.validated;

        if(!identity_token)
        {
            res.status(400).json({ error: "Identity token is required" });
            return;
        }

        const decoded: Jwt | null= jwt.decode(identity_token, { complete: true });

        if(!decoded)
        {
            res.status(400).json({ error: "Invalid identity token" });
            return;
        }

        const key: any = await client.getSigningKey(decoded.header.kid);
        const publicKey: any = key.getPublicKey();

        const verified: string | JwtPayload = jwt.verify(identity_token, publicKey, { algorithms: ['RS256'], audience: "com.namsecure.app", issuer: 'https://appleid.apple.com' });

        req.apple = verified; // @todo type this properly
        next();
    }
    catch (error: any)
    {
        console.error(error);
        res.status(401).json({ error: "Unauthorized" });
    }
};