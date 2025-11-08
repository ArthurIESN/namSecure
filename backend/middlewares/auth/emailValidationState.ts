import {Response, Request, NextFunction} from "express";
import {IAuthMember} from "../../types/user/user.js";

export const emailValidationState = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const member: IAuthMember = req.member as IAuthMember;

    if(member.email_checked)
    {
        res.status(403).json({error: "Forbidden: Email is already validated"});
        return;
    }

    next();
}