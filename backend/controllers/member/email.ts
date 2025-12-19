import { Request, Response, NextFunction } from "express";
import * as emailModel from "@/models/member/email";
import { IAuthUser } from "@/types/user/user";
import { NotFoundError } from "@/errors/NotFoundError";
import { PasswordError } from "@/errors/password/PasswordError";
import { UniqueConstraintError } from "@/errors/database/UniqueConstraintError";
import { clearTokenCookie } from "@/utils/cookie/cookie";

export const changeEmail = async (req: Request, res: Response, _next: NextFunction) =>
{
    const { new_email, password }: { new_email: string, password: string } = req.validated;
    const user: IAuthUser = req.user as IAuthUser;

    try
    {
        await emailModel.changeEmail(user.id, user.email, password, new_email);

        clearTokenCookie(res);

        res.status(200).json({
            message: "Email updated successfully. Please log in again with your new email.",
            member: {
                id: user.id,
                email: new_email
            }
        });
    }
    catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
            return;
        }

        if (error instanceof PasswordError)
        {
            res.status(400).json({ error: error.message });
            return;
        }

        if (error instanceof UniqueConstraintError)
        {
            res.status(409).json({ error: "Email already in use" });
            return;
        }

        console.error("Error changing email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}