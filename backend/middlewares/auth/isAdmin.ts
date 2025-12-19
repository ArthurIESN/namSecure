import {Request, Response, NextFunction} from "express";
import {IAuthMember} from "../../types/user/user.js";

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const member: IAuthMember = req.member as IAuthMember;

    if(!member.member_role || member.member_role.name !== "admin")
    {
        res.status(403).json({error: "Forbidden"});
        return;
    }

    next();
}