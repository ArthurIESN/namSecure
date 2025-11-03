import prisma from '../../database/databasePrisma.js';
import { IIdValidationStatus } from "@namSecure/shared/types/auth/auth.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import * as uuid from 'uuid'
import {saveImage} from "../../utils/upload/upload.js";
import {SharpOptions} from "sharp";

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

export const idVerify = async (frontIdCard: File, backIdCard: File, userId: number): Promise<void> =>
{
    const user = await prisma.member.findUnique({ where: { id: userId }, include: { member_id_check: true} });

    if(!user)
    {
        throw new NotFoundError(`User not found`);
    }

    if(user.member_id_check)
    {
        if(user.member_id_check.reject_reason === null)
        {
            throw new Error("ID validation is already pending");
        }
        else
        {
            const globalUUID = uuid.v4();
            const frontCardId: SharpOptions = await saveImage(await frontIdCard.arrayBuffer(), globalUUID, 'uploads/id_validation/front');
            const backCardId: SharpOptions = await saveImage(await backIdCard.arrayBuffer(), globalUUID, 'uploads/id_validation/back');

            if(!frontCardId || !backCardId)
            {
                throw new Error("Failed to save ID card images"); //@todo custom error
            }

            await prisma.member_id_check.update(
            {
                where: { id: user.member_id_check.id },
                data:
                {
                    card_photo_id: globalUUID,
                    reject_reason: null,
                }
            });
        }
    }
    else
    {
        const globalUUID: string = uuid.v4();
        const frontCardId: SharpOptions = await saveImage(await frontIdCard.arrayBuffer(), globalUUID, 'uploads/id_validation/front');
        const backCardId: SharpOptions = await saveImage(await backIdCard.arrayBuffer(), globalUUID, 'uploads/id_validation/back');

        if(!frontCardId || !backCardId)
        {
            throw new Error("Failed to save ID card images"); //@todo custom error
        }

        // transaction to create member_id_check and then update member with the new member_id_check id
        await prisma.$transaction(async (prisma) =>
        {
            const newIdCheck = await prisma.member_id_check.create(
            {
                data:
                {
                    card_photo_id: globalUUID,
                    reject_reason: null,
                }
            });

            await prisma.member.update(
            {
                where: { id: userId },
                data:
                {
                    id_member_id_check: newIdCheck.id
                }
            });
        });
    }
}