import prisma from "../../database/databasePrisma.js";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member";
import {UniqueConstraintError} from "@/errors/database/UniqueConstraintError.js";
import {ForeignKeyConstraintError} from "@/errors/database/ForeignKeyConstraintError.js";
import {NotFoundError} from "@/errors/NotFoundError.js";
import {databaseErrorCodes} from "@/utils/prisma/prismaErrorCodes.js";


export const getAllTeamMembers = async(limit: number, offset: number, search: string = "") : Promise<ITeamMember[]> =>{
    const dbTeamMembers = await prisma.team_member.findMany({
        where: search ? {
            OR: [
                {
                    team: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    member: {

                        OR: [
                            {
                                first_name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                last_name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                }
            ]
        } : {},
        include: {
            member : {
                omit:{
                    password: true,
                }
            },
            team: true
        },
        take: limit,
        skip: offset,
        orderBy: { id: 'asc' }
    });

    return dbTeamMembers.map(tm => ({
        id: tm.id,
        accepted: tm.accepted,
        team:{
            admin: tm.team.id_admin,
            id: tm.team.id,
            name: tm.team.name,
            report: tm.team.id_report
        },
        member: {
            ...tm.member,
            role: tm.member.id_role,
            twoFA: tm.member.id_member_2fa,
            id_check: tm.member.id_member_id_check,
            validation_code: tm.member.id_validation_code,
        }
    }));
}

export const createTeamMember = async (id_team: number, id_member: number, accepted: boolean = false) : Promise<void> => {
    try {
        await prisma.team_member.create({
            data: {
                accepted: accepted,
                id_team: id_team,
                id_member: id_member
            }
        });

    } catch (error: any) {
        console.error(error);
        if (error.code === databaseErrorCodes.UniqueConstraintViolation) {
            throw new UniqueConstraintError("This member is already in this team.");
        }

        if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation) {
            const field = error.meta?.field_name;
            if (field === 'id_team') {
                throw new ForeignKeyConstraintError("The specified team does not exist.");
            } else if (field === 'id_member') {
                throw new ForeignKeyConstraintError("The specified member does not exist.");
            } else {
                throw new ForeignKeyConstraintError("Invalid reference.");
            }
        }
        throw error;
    }
}


export const deleteTeamMember = async (id: number) : Promise<void> =>{
    try{
        await prisma.team_member.delete({
            where: {
               id: id
            }
        });
    }catch (error : any){
        console.error(error);
        if (error.code === databaseErrorCodes.RecordNotFound) {
            throw new NotFoundError(`Team member not found.`);
        }

        if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation) {
            throw new ForeignKeyConstraintError("Cannot delete: this team member is referenced elsewhere.");
        }

        throw error;
    }
}


export const updateTeamMember = async (id: number, accepted: boolean) : Promise<void> => {
    try {
        await prisma.team_member.update({
            where: { id: id },
            data: {
                accepted: accepted
            }
        });
    } catch (error: any) {
        console.error(error);
        if(error.code === databaseErrorCodes.RecordNotFound){
            throw new NotFoundError(`Team member not found.`);
        }

        throw error;
    }
}