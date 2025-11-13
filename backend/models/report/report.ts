import prisma from "../../database/databasePrisma.js";
import {IReport} from "@namSecure/shared/types/report/report.js";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";

export const getReports = async (limit: number, offset: number, search: string): Promise<IReport[]> =>
{
    const dbReports: any[] = await prisma.report.findMany(
    {
        include: {
            type_danger: true,
            member: true
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
        lat: dbReport.lat,
        lng: dbReport.lng,
        street: dbReport.street,
        level: dbReport.level,
        is_public: dbReport.is_public,
        photo_path: dbReport.photo_path,
        member: {
            id: dbReport.member.id,
            apple_id: dbReport.member.apple_id,
            first_name: dbReport.member.first_name,
            last_name: dbReport.member.last_name,
            email: dbReport.member.email,
            birthday: dbReport.member.birthday,
            password_last_update: dbReport.member.password_last_update,
            address: dbReport.member.address,
            email_checked: dbReport.member.email_checked,
            id_checked: dbReport.member.id_checked,
            created_at: dbReport.member.created_at,
            photo_path: dbReport.member.photo_path,
            national_registry: dbReport.member.national_registry,
            password: "", // Do not expose password (even hashed)
            role: dbReport.member.id_role,
            twoFA: dbReport.member.id_member_2fa,
            id_check: dbReport.member.id_member_id_check,
            validation_code: dbReport.member.id_validation_code
        },
        type_danger: dbReport.type_danger,
    }));

    return reports;
}

export const getReport = async (id: number): Promise<IReport> =>
{
    const dbReport: any  = await prisma.report.findUnique(
    {
        where: { id: id },
        include: {
            type_danger: true,
            member: {
            }
        }
    });

    if(!dbReport)
    {
        throw new NotFoundError("Member not found");
    }

    const report : IReport = {
        id: dbReport.id,
        date: dbReport.date,
        lat: dbReport.lat,
        lng: dbReport.lng,
        street: dbReport.street,
        level: dbReport.level,
        is_public: dbReport.is_public,
        photo_path: dbReport.photo_path,
        member: {
            ...(dbReport.member),
            password: "", // Do not expose password (even hashed)
        },
        type_danger: dbReport.type_danger,
    };

    return report;
}

export const createReport = async (report: IReport): Promise<void> =>
{
    try
    {
        const dbReport : any = await prisma.report.create(
            {
                data:
                    {
                        date: report.date,
                        lat: report.lat,
                        lng: report.lng,
                        street: report.street,
                        level: report.level,
                        is_public: report.is_public,
                        photo_path : report.photo_path,
                        id_member : report.member.id,
                        id_type_danger : report.type_danger.id
                    }
            });

        if(!dbReport)
        {
            //@todo custom error handling
            throw new Error("Failed to create report");
        }
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
                        photo_path : report.photo_path,
                        id_member : report.member.id,
                        id_type_danger : report.type_danger.id
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