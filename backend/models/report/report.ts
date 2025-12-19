import prisma from "../../database/databasePrisma.js";
import {IReport} from "@namSecure/shared/types/report/report.js";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";

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
        member: {
            ...dbReport.member,
            twoFA: dbReport.member.id_member_2fa,
            role: dbReport.member.id_role,
            id_check: dbReport.member.id_member_id_check,
            validation_code: dbReport.member.id_validation_code
        },
        type_danger: dbReport.type_danger,
    }));

    return reports;
}


export const getReport = async (id: number): Promise<IReport | null> =>
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

    if (!dbReport) {
        return null;
    }

    return {
        id: dbReport.id,
        date: dbReport.date,
        lat: Number(dbReport.lat),
        lng: Number(dbReport.lng),
        street: dbReport.street,
        level: dbReport.level,
        is_public: dbReport.is_public,
        for_police: dbReport.for_police,
        photo_path: dbReport.photo_path,
        member:
            {
                ...dbReport.member,
                twoFA: dbReport.member.id_member_2fa,
                role: dbReport.member.id_role,
                id_check: dbReport.member.id_member_id_check,
                validation_code: dbReport.member.id_validation_code
            },
        type_danger: dbReport.type_danger,
    };
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
                    },
                include: {
                    type_danger: true,
                }
            });

        if(!dbReport)
        {
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
            type_danger: dbReport.type_danger,
        }

        return createdReport;

    }
    catch (error : any)
    {
        console.error(error);
        if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint: string = error.meta?.constraint as string || '';
            if(constraint === "report_id_member_fkey")
            {
                throw new ForeignKeyConstraintError("Member ID does not reference a valid entry");
            }
            else if (constraint === "report_id_type_danger_fkey")
            {
                throw new ForeignKeyConstraintError("Type Danger ID does not reference a valid entry");
            }

            throw new ForeignKeyConstraintError("Does not reference a valid entry");
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
                        id_member : report.member as number,
                        id_type_danger : report.type_danger as number
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
            const constraint: string = error.meta?.constraint as string || '';

            if(constraint === "report_id_member_fkey")
            {
                throw new ForeignKeyConstraintError("Member ID does not reference a valid entry");
            }
            else if (constraint === "report_id_type_danger_fkey")
            {
                throw new ForeignKeyConstraintError("Type Danger ID does not reference a valid entry");
            }

            throw new ForeignKeyConstraintError("Does not reference a valid entry");
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

export const getReportsForUser = async (userId: number): Promise<IReport[]> =>
{
    const twoHoursAgo : Date = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const userTeams = await prisma.team_member.findMany({
        where: {
            id_member: userId,
            accepted: true
        },
        select: {
            id_team: true
        }
    });

    const userTeamIds : number[] = userTeams.map(tm => tm.id_team);

    const teamMates = await prisma.team_member.findMany({
        where: {
            id_team: { in: userTeamIds },
            accepted: true,
            id_member: { not: userId } // Exclure l'utilisateur lui-même (optionnel)
        },
        select: {
            id_member: true
        }
    });

    const teamMateIds : number[] = [...new Set(teamMates.map(tm => tm.id_member))];

    const dbReports = await prisma.report.findMany({
        where: {
            date: {
                gte: twoHoursAgo
            },
            OR: [
                { is_public: true },
                // Reports privés de l'utilisateur lui-même
                {
                    is_public: false,
                    id_member: userId
                },
                {
                    is_public: false,
                    id_member: { in: teamMateIds }
                }
            ]
        },
        include: {
            type_danger: true,
            member: {
                omit: {
                    password: true,
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    const reports: IReport[] = dbReports.map(dbReport => ({
        id: dbReport.id,
        date: dbReport.date,
        lat: Number(dbReport.lat),
        lng: Number(dbReport.lng),
        street: dbReport.street,
        level: dbReport.level,
        is_public: dbReport.is_public,
        for_police: dbReport.for_police,
        photo_path: dbReport.photo_path,
        member:
            {
                ...dbReport.member,
                twoFA: dbReport.member.id_member_2fa,
                role: dbReport.member.id_role,
                id_check: dbReport.member.id_member_id_check,
                validation_code: dbReport.member.id_validation_code
            },
        type_danger: dbReport.type_danger,
    }));

    return reports;
}