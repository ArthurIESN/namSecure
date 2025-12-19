import prisma from "@/database/databasePrisma.js";
import {ITypeDanger} from "@namSecure/shared/types/type_danger/type_danger.js";
import {databaseErrorCodes} from "@/utils/prisma/prismaErrorCodes";
import {NotFoundError} from "@/errors/NotFoundError";
import { ForeignKeyConstraintError } from "@/errors/database/ForeignKeyConstraintError";

export const getTypeDangers = async (limit: number, offset: number, search: string): Promise<ITypeDanger[]> =>
{
    return prisma.type_danger.findMany(
    {
        take: limit,
        skip: offset * limit,
        where:
            {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        icon: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
        orderBy: search ? { name: 'asc' } : { id: 'asc' }
    });
}

export const getTypeDangersUsed = async (): Promise<ITypeDanger[]> =>
{
    return prisma.type_danger.findMany(
    {
        where:
            {
                is_used: true,
                name: {
                    mode: 'insensitive'
                }
            },
    });
}

export const getTypeDanger = async (id: number): Promise<ITypeDanger | null> =>
{
    return prisma.type_danger.findUnique(
    {
        where:{id: id}
    });
}

export const createTypeDanger = async (typeDanger: Omit<ITypeDanger, "id">): Promise<ITypeDanger> =>
{
    return prisma.type_danger.create({
        data:
            {
                name: typeDanger.name,
                icon: typeDanger.icon,
                is_used: typeDanger.is_used
            }
    });
}

export const updateTypeDanger = async (typeDanger : ITypeDanger): Promise<void> =>
{
    try{
        await prisma.type_danger.update(
        {
            where: { id: typeDanger.id },
            data:
                {
                    name : typeDanger.name,
                    icon : typeDanger.icon,
                    is_used : typeDanger.is_used
                }
        });
    }
    catch(error: any)
    {
        if(error.typeDanger === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("TypeDanger not found");
        }
        throw error;
    }
}

export const deleteTypeDanger = async (id: number): Promise<void> =>
{
    try
    {
        await prisma.type_danger.delete(
        {
            where: { id: id }
        });
    } catch(error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("TypeDanger not found");
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            throw new ForeignKeyConstraintError("Cannot delete TypeDanger as it is referenced by a repport.");
        }
        throw error;
    }
}