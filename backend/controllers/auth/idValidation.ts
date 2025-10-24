
import {IAuthUser} from "../../types/user/user";
import {Request, Response, NextFunction} from "express";

export const idValidation = async (req: Request, res: Response, next: NextFunction) =>
{
    const user: IAuthUser = req.user as IAuthUser;

    try
    {

    }
    catch (error: any)
    {

    }
}