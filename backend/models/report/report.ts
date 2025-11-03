import prisma from "../../database/databasePrisma.js";
import {IReport} from "@namSecure/shared/types/report/report.js";

export const getReports = async (limit: number, offset: number, search: string): Promise<IReport[]> =>
{
    return prisma.report.findMany(
    {
        take: limit,
        skip: offset * limit,
        where:
            {
                name : {
                    contains: search,
                    mode: 'insensitive'
                }
            },
        orderBy: search ? { name: 'asc' } : { id: 'asc' }
    });}