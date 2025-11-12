import prisma from '@/database/databasePrisma';
import {IMember_2FA} from "@namSecure/shared/types/member_2fa/member_2fa";
import {databaseErrorCodes} from "@/utils/prisma/prismaErrorCodes";
import {NotFoundError} from "@/errors/NotFoundError";

export const getTwoFactors = async (limit: number, offset: number, search: string): Promise<IMember_2FA[]> =>
{
    return prisma.member_2fa.findMany(
        {
            take: limit,
            skip: offset * limit,
            where:
                {
                    secret_key: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
            orderBy: search ? { secret_key: 'asc' } : { id: 'asc' }
        });
}

export const getTwoFactor = async (id: number): Promise<IMember_2FA | null> =>
{
    return prisma.member_2fa.findUnique(
    {
        where: {id: id}
    });
}

export const createTwoFactor = async (twoFactor: IMember_2FA): Promise<void> =>
{
    await prisma.member_2fa.create({
        data:
            {
                secret_key: twoFactor.secret_key,
                is_enabled: twoFactor.is_enabled,
                created_at: twoFactor.created_at
            }
    });
}

export const updateTwoFactor = async (twoFactor: IMember_2FA): Promise<void> =>
{
    try
    {
        await prisma.member_2fa.update({
            where:
                {
                    id: twoFactor.id
                },
            data:
                {
                    secret_key: twoFactor.secret_key,
                    is_enabled: twoFactor.is_enabled,
                    created_at: twoFactor.created_at
                }
        });
    }
    catch (error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("TwoFactor not found");
        }

        throw error;
    }
}

export const deleteTwoFactor = async (id: number): Promise<void> =>
{
    try
    {
        await prisma.member_2fa.delete({
            where:
                {
                    id: id
                }
        });
    }
    catch (error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("TwoFactor not found");
        }
        else if(error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            throw new Error("Cannot delete TwoFactor, it is referenced by other records");
        }

        throw error;
    }
}

