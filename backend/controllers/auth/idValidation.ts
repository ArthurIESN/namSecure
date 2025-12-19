import {IAuthUser} from "@/types/user/user";
import {Request, Response, NextFunction} from "express";
import * as idValidationModel from '@/models/auth/idValidation';
import {IIdValidationStatus} from "@namSecure/shared/types/auth/auth";

export const idValidation = async (req: Request, res: Response): Promise<void> =>
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

export const idVerify = async (req: Request, res: Response): Promise<void> =>
{
    const user: IAuthUser = req.user as IAuthUser;
    const { front_id_card, back_id_card } = req.validated;


    try
    {
        await idValidationModel.idVerify(front_id_card, back_id_card, user.id);

        res.status(200).json({ message: "ID verification request submitted successfully." });
    }
    catch (error: any)
    {
        //@todo when custom error classes will be created, handle them here
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}