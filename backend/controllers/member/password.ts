import {Request, Response, NextFunction} from "express";
import * as passwordModel from "@/models/member/password";
import {IAuthUser} from "@/types/user/user";
import {NotFoundError} from "@/errors/NotFoundError";
import {PasswordError} from "@/errors/password/PasswordError";
import {JwtPayload} from "jsonwebtoken";
import {verifyJWT} from "@utils/jwt/jwt";

export const change = async (req: Request, res: Response, _next: NextFunction) =>
{
    const { current_password, new_password }: { current_password: string, new_password: string} = req.validated;
    const user: IAuthUser = req.user as IAuthUser;

    try
    {
        await passwordModel.change(user.id, user.email, current_password, new_password);
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error: any)
    {

        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
            return;
        }

        if(error instanceof PasswordError)
        {
            res.status(400).json({ error: error.message });
            return;
        }

        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const reset = async (req: Request, res: Response, _next: NextFunction) =>
{
    const { email }: {email: string} = req.validated;

    try
    {
        await passwordModel.reset(email);
        res.status(200).json({ message: "Reset email sent successfully" });
    }
    catch (error: any)
    {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const resetConfirm = async (req: Request, res: Response, _next: NextFunction) =>
{
    const {token, newPassword}: { token: string, newPassword: string } = req.validated;
    try {

        let jwt: JwtPayload | string;

        try {
            jwt = await verifyJWT(token);
        } catch (tokenError: any)
        {
            res.status(400).json({error: "Invalid or expired token"});
            return;
        }

        if (typeof jwt === 'string')
        {
            res.status(400).json({error: "Invalid token"});
            return;
        }

        const email: string = jwt.email;
        const userId: number = jwt.userId;

        await passwordModel.resetConfirm(email, newPassword, userId);
        res.status(200).json({message: "Password has been reset successfully"});
    } catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({error: error.message});
            return;
        }

        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')
        {
            res.status(400).json({error: "Invalid or expired token"});
            return;
        }

        console.log(error);

        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const verify = async (req: Request, res: Response, _next: NextFunction) =>
{
    const { password }: { password: string } = req.validated;
    const user: IAuthUser = req.user as IAuthUser;

    try
    {
        const isPasswordValid: boolean = await passwordModel.verify(user.id, password);

        if (!isPasswordValid)
        {
            res.status(400).json({ error: "Password is incorrect" });
            return;
        }

        res.status(200).json({ message: "Password verified successfully" });
    }
    catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({error: error.message});
            return;
        }
    }
}