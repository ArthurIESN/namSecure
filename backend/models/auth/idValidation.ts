import prisma from '../../database/databasePrisma.js';
import { IIdValidationStatus } from "@namSecure/shared/types/auth/auth.js";
import {NotFoundError} from "../../errors/NotFoundError.js";

export const idValidation = async (userId: number): Promise<IIdValidationStatus> =>
{
    const user = await prisma.member.findUnique({
        where: { id: userId },
        include: { member_id_check: true}}
    );

    if(!user)
    {
        throw new NotFoundError(`User not found`);
    }

    let status: IIdValidationStatus;

    if(!user.member_id_check)
    {
        status =
        {
            isRequested: false,
            isPending: false,
            isRejected: false,
            message: "No ID validation requested"
        };
    }
    else if(user.member_id_check.reject_reason === null)
    {
        status =
        {
            isRequested: true,
            isPending: true,
            isRejected: false,
            message: "ID validation is pending"
        };
    }
    else
    {
        status =
        {
            isRequested: true,
            isPending: false,
            isRejected: true,
            message: user.member_id_check.reject_reason
        };
    }

    return status;
};

//export const idVerify =