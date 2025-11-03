import {Request, Response, NextFunction} from "express";
import {IAuthMember} from "../../types/user/user";

export const isFullyAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const member: IAuthMember = req.member as IAuthMember;

    if(!member.email_checked || !member.id_checked)
    {
        res.status(403).json({error: "Forbidden: Incomplete authentication"});
        return;
    }

    next();
}