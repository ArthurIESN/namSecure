import {Response, Request, NextFunction} from "express";
import {IAuthMember} from "../../types/user/user.js";
export const idValidationState = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const member: IAuthMember = req.member as IAuthMember;

    if(!member.email_checked)
    {
        res.status(401).json({error: "Email must be validated first"});
        return;
    }

    if(member.id_checked)
    {
        res.status(403).json({error: "Forbidden: id is already validated"});
        return;
    }

    next();
}