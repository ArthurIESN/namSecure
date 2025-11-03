import {Request, Response, NextFunction} from "express";
import * as passwordModel from "../../models/member/password.js";
import {IAuthUser} from "../../types/user/user.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {PasswordError} from "../../errors/password/PasswordError.js";

export const change = async (req: Request, res: Response, _next: NextFunction) =>
{
    const { current_password, new_password } = req.validated;
    const user: IAuthUser = req.user as IAuthUser;

    try
    {
        await passwordModel.change(user.id, current_password, new_password);
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
    const { email } = req.validated;

    try
    {
        await passwordModel.reset(email);
        res.status(200).json({ message: "NOT IMPLEMENTED YET" });
    }
    catch (error: any)
    {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}