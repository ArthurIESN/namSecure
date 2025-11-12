import {Request, Response, NextFunction} from "express";
import {IAuthMember, IAuthUser} from "@/types/user/user.js";

export const isFullyAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const member: IAuthMember = req.member as IAuthMember;
    const user: IAuthUser = req.user as IAuthUser;

    const useTwoFactor: boolean = member.member_2fa?.is_enabled || false;

    if(useTwoFactor && !user.twoFactorVerified)
    {
        res.status(403).json({error: "Forbidden: Two-factor authentication required"});
        return;
    }

    if(!member.email_checked || !member.id_checked)
    {
        res.status(403).json({error: "Forbidden: Incomplete authentication"});
        return;
    }

    next();
}