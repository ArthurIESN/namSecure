import prisma from "@/database/databasePrisma.js";
import {IValidationCode} from "@namSecure/shared/types/validation_code/validation_code";
import {databaseErrorCodes} from "@/utils/prisma/prismaErrorCodes";
import {NotFoundError} from "@/errors/NotFoundError";


export const getValidationCodes = async (limit: number, offset: number, search: string): Promise<IValidationCode[]> =>
{
    return prisma.validation_code.findMany(
    {
        take: limit,
        skip: offset * limit,
        select:
        {
            id: true,
            expires_at: true,
            attempts: true
        },
        where:
            {
                code_hash: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
        orderBy: search ? { code_hash: 'asc' } : { id: 'asc' }
    });
}

export const getValidationCode = async (id: number): Promise<IValidationCode | null> =>
{
    return prisma.validation_code.findUnique(
    {
    select:
        {
            id: true,
            expires_at: true,
            attempts: true
        },
        where:{id: id}
    });
}

export const createValidationCode = async (validationCode: IValidationCode): Promise<void> =>
{
    await prisma.validation_code.create({
        data:
            {
                code_hash: validationCode.code_hash!,
                expires_at: validationCode.expires_at,
                attempts: validationCode.attempts
            }
    });
}

export const updateValidationCode = async (validationCode: IValidationCode): Promise<void> =>
{
    try
    {
        await prisma.validation_code.update(
            {
                where: { id: validationCode.id },
                data:
                    {
                        ...(validationCode.code_hash && { code_hash: validationCode.code_hash }),
                        expires_at : validationCode.expires_at,
                        attempts : validationCode.attempts
                    }
            });
    }
    catch (error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Validation code not found");
        }
        throw error;
    }

}

export const deleteValidationCode = async (id: number): Promise<void> =>
{
    try
    {
        await prisma.validation_code.delete(
            {
                where: { id: id }
            });
    }
    catch (error : any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Validation code not found");
        }
        else if(error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            throw new Error("Cannot delete validation code: Foreign key constraint violation");
        }

        throw error;
    }
}