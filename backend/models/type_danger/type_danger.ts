import prisma from "../../database/databasePrisma.js";
import {ITypeDanger} from "@namSecure/shared/types/type_danger/type_danger.js";

export const getTypeDangers = async (limit: number, offset: number, search: string): Promise<ITypeDanger[]> =>
{
    return prisma.type_danger.findMany(
    {
        take: limit,
        skip: offset * limit,
        where:
            {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
        orderBy: search ? { name: 'asc' } : { id: 'asc' }
    });
}