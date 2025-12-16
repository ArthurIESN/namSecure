import prisma from "../../database/databasePrisma.js";
import {IReport} from "@namSecure/shared/types/report/report.js";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";
import {ITypeDanger} from "@namSecure/shared/types/type_danger/type_danger";
import {IMember} from "@namSecure/shared/types/member/member";

export const getReports = async (limit: number, offset: number, search: string): Promise<IReport[]> =>
{
    const dbReports = await prisma.report.findMany(
    {
        include: {
            type_danger: true,
            member: {
                omit: {
                    password: true,
                }
            }
        },
        take: limit,
        skip: offset * limit,
        where:
            {
                street: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
        orderBy: search ? { street: 'asc' } : { id: 'asc' }
    });

    const reports : IReport[] = dbReports.map(dbReport => ({
        id: dbReport.id,
        date: dbReport.date,
        lat: Number(dbReport.lat),
        lng: Number(dbReport.lng),
        street: dbReport.street,
        level: dbReport.level,
        is_public: dbReport.is_public,
        for_police: dbReport.for_police,
        photo_path: dbReport.photo_path,
        member: dbReport.member,
        type_danger: dbReport.type_danger,
    }));

    return reports;
}

export const getReport = async (id: number): Promise<IReport> =>
{
    const dbReport = await prisma.report.findUnique(
    {
        where: { id: id },
        include: {
            type_danger: true,
            member: {
                omit: {
                    password: true,
                }
            }
        }
    });

    //@todo useless check
    if(!dbReport)
    {
        throw new NotFoundError("Member not found");
    }

    const report : IReport = {
        id: dbReport.id,
        date: dbReport.date,
        lat: Number(dbReport.lat),
        lng: Number(dbReport.lng),
        street: dbReport.street,
        level: dbReport.level,
        is_public: dbReport.is_public,
        for_police: dbReport.for_police,
        photo_path: dbReport.photo_path,
        member: dbReport.member,
        type_danger: dbReport.type_danger,
    };

    return report;
}

export const createReport = async (report: IReport): Promise<IReport> =>
{
    try
    {
        const dbReport = await prisma.report.create(
            {
                data:
                    {
                        date: report.date,
                        lat: report.lat,
                        lng: report.lng,
                        street: report.street,
                        level: report.level,
                        is_public: report.is_public,
                        for_police: report.for_police,
                        photo_path : report.photo_path,
                        id_member : report.member as number,
                        id_type_danger : report.type_danger as number
                    }
            });

        if(!dbReport)
        {
            //@todo custom error handling
            throw new Error("Failed to create report");
        }

        const createdReport: IReport = {
            id: dbReport.id,
            date: dbReport.date,
            lat: Number(dbReport.lat),
            lng: Number(dbReport.lng),
            street: dbReport.street,
            level: dbReport.level,
            is_public: dbReport.is_public,
            for_police: dbReport.for_police,
            photo_path: dbReport.photo_path,
            member: dbReport.id_member,
            type_danger: dbReport.id_type_danger
        }

        return createdReport;
    }
    catch (error : any)
    {
        console.error(error);
        if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint = error.meta?.constraint;

            throw new ForeignKeyConstraintError(constraint + " does not reference a valid entry");
        }
        else
        {
            console.error("Error creating report:", error);
            throw error;
        }
    }
}

export const updateReport = async (report : IReport): Promise<void> =>
{
    try{
        await prisma.report.update(
            {
                where: { id: report.id },
                data:
                    {
                        date: report.date,
                        lat: report.lat,
                        lng: report.lng,
                        street: report.street,
                        level: report.level,
                        is_public: report.is_public,
                        for_police: report.for_police,
                        photo_path : report.photo_path,
                        id_member : (report.member as IMember).id,
                        id_type_danger : (report.type_danger as ITypeDanger ).id
                    }
            });
    }
    catch(error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Report not found");
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint = error.meta?.constraint;

            throw new ForeignKeyConstraintError(constraint + " does not reference a valid entry");
        }
        throw error;
    }
}

export const deleteReport = async (id: number): Promise<void> =>
{
    try
    {
        await prisma.report.delete(
            {
                where: { id: id }
            });
    } catch(error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Report not found");
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            throw new ForeignKeyConstraintError("Cannot delete Report as it is referenced by a team.");
        }
        throw error;
    }
}