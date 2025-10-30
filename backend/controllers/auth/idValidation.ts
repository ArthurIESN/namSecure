
import {IAuthUser} from "../../types/user/user";
import {Request, Response, NextFunction} from "express";
import * as idValidationModel from '../../models/auth/idValidation.js';
import {IIdValidationStatus} from "@namSecure/shared/types/auth/auth";

export const idValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const user: IAuthUser = req.user as IAuthUser;

    try
    {
        const status: IIdValidationStatus = await idValidationModel.idValidation(user.id);

        res.status(200).json(status);
    }
    catch (error: any)
    {

    }
}

export const idVerify = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
{
    const user: IAuthUser = req.user as IAuthUser;

    try
    {

    }
    catch (error: any)
    {

    }
}