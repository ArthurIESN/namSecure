import prisma from "../../database/databasePrisma.js";
import {ITeam} from "@namSecure/shared/types/team/team";
import {databaseErrorCodes} from "@/utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "@/errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "@/errors/database/ForeignKeyConstraintError.js";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member";


// @todo: ??
interface UpdateTeamData {
    id: number;
    name: string;
    id_member: number;
    id_report: number | null;
    team_member?: ITeamMember[];
}

export const getTeams = async (limit : number, offset: number, search: string ): Promise<ITeam[]> => {
    const dbTeams= await prisma.team.findMany({
        where: search ? {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        } : {},
        include : {
            member: {
                omit: {
                    password: true,
                }
            },
            team_member : true,
            report: true
        },
        take : limit,
        skip : offset,
        orderBy: { id: 'asc' }
    })

    console.debug(dbTeams[0]?.team_member);

     return  dbTeams.map(team => ({
        id: team.id,
        name: team.name,
        id_admin: team.id_admin,
        admin: {
            ...team.member,
            twoFA: null,
            role: team.member.id_role,
            id_check: null,
            validation_code: null
        },
        report: team.report ? {
            id: team.report.id,
            date: team.report.date,
            lat: Number(team.report.lat),
            lng: Number(team.report.lng),
            street: team.report.street,
            level: team.report.level,
            is_public: team.report.is_public,
            for_police: team.report.for_police,
            photo_path: team.report.photo_path,
            member: team.report.id_member,
            type_danger: team.report.id_type_danger,
        } : null,
         team_member: team.team_member.map(tm => ({
             ...tm,
             member: tm.id_member,
             team: tm.id_team
         }))
     }))
}

export const getMyTeams = async (userId: number, limit: number): Promise<ITeam[]> => {
    const dbTeams = await prisma.team.findMany({
        where:
        {
            team_member:
                {
                    some:
                    {
                        id_member: userId
                    }
                }
        },
        include:
        {
            member:
                {
                    omit:
                    {
                        password: true,
                    }
                },
            report: true
        },
        take : limit,
    });

    return dbTeams.map(team => ({
        ...team,
        admin:
            {
                ...team.member,
                twoFA: team.member.id_member_2fa,
                role: team.member.id_role,
                id_check: team.member.id_member_id_check,
                validation_code: team.member.id_validation_code,
            },
        report: team.id_report as number
    }));
}

export const getTeam = async (id : number): Promise<ITeam> => {
    const dbTeam = await prisma.team.findUnique({
        where : {
            id : id
        },
        include : {
            member: true,
            report: true,
            team_member: {
                include: {
                    member: true
                }
            },
        }
    });

    if(!dbTeam){
        throw new Error("Team not found");
    }

    return {
        id: dbTeam.id,
        name: dbTeam.name,
        admin: {
            ...dbTeam.member,
            password: '',
            twoFA: null,
            role: dbTeam.member.id_role,
            id_check: null,
            validation_code: null
        },
        report: dbTeam.report ? {
            id: dbTeam.report.id,
            date: dbTeam.report.date,
            lat: Number(dbTeam.report.lat),
            lng: Number(dbTeam.report.lng),
            street: dbTeam.report.street,
            level: dbTeam.report.level,
            is_public: dbTeam.report.is_public,
            for_police: dbTeam.report.for_police,
            photo_path: dbTeam.report.photo_path,
            member: dbTeam.report.id_member,
            type_danger: dbTeam.report.id_type_danger,
        } : null,
        team_member: dbTeam.team_member,
    };

}

export const createTeamWithMember = async (name: string, id_member: number, team_member: ITeamMember[]): Promise<ITeam> => {
    return prisma.$transaction(async (tx) => {
        const allMemberIds = [
            id_member,
            ...team_member.map(m => m.id_member as number)
        ];

        for (const memberId of allMemberIds) {
            const currentTeamCount = await tx.team_member.count({
                where: {
                    id_member: memberId
                }
            });

            if (currentTeamCount >= 2) {
                const member = await tx.member.findUnique({
                    where: { id: memberId },
                    select: {
                        first_name: true,
                        last_name: true
                    }
                });

                const memberName = member
                    ? `${member.first_name} ${member.last_name}`
                    : `Membre #${memberId}`;

                throw new Error(
                    `${memberName} est déjà membre de ${currentTeamCount} équipes et ne peut pas rejoindre une nouvelle équipe.`
                );
            }
        }

        if (!team_member.find(member => member.id_member === id_member)) {
            team_member.push({
                id: 0,
                id_member: id_member,
                accepted: true,
            });
        }

        const newTeam = await tx.team.create({
            data: {
                name: name,
                id_admin: id_member,
                id_report: null,
                team_member: {
                    createMany: {
                        data: team_member.map(teamMember => ({
                            id_member: teamMember.id_member as number,
                            accepted: teamMember.accepted
                        }))
                    }
                }
            },
            include: {
                team_member: {
                    include: {
                        member: true
                    }
                },
                report: true,
                member: true
            }
        });

        return {
            id: newTeam.id,
            name: newTeam.name,
            id_admin: newTeam.id_admin,
            admin: {
                ...newTeam.member,
                password: '',
                twoFA: null,
                role: newTeam.member.id_role,
                id_check: null,
                validation_code: null
            },
            report: null,
            team_member: newTeam.team_member
        };
    });
}

export const updateTeam = async (data: UpdateTeamData): Promise<ITeam> => {
    try {
        return await prisma.$transaction(async (tx) => {

            await tx.team.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    id_admin: data.id_member,
                    id_report: data.id_report
                }
            });
            await tx.team_member.deleteMany({
                where: {
                    id_team: data.id,
                }
            });




            const adminMember = data.team_member?.find(m => m.id_member === data.id_member);
            if(adminMember){
                adminMember.accepted = true;
            }else{
                data.team_member!.push({
                    id:0,
                    id_member: data.id_member,
                    accepted: true
                });
            }
            await tx.team_member.createMany({
                data: data.team_member!.map(m => ({
                    id_team: data.id,
                    id_member: typeof m.id_member === 'number' ? m.id_member : m.id_member.id,
                    accepted: m.accepted
                })),
                skipDuplicates: true
            });


            const updatedTeam = await tx.team.findUnique({
                where: { id: data.id },
                include: {
                    team_member: true,
                    report: true
                }
            });

            if (!updatedTeam) {
                throw new NotFoundError("Team not found");
            }

            return updatedTeam;
        });
    } catch (error: any) {
        if (error.code === databaseErrorCodes.RecordNotFound) {
            throw new NotFoundError("Team not found");
        } else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation) {
            const constraint = error.meta?.constraint;
            throw new ForeignKeyConstraintError(constraint + " does not reference a valid entry.");
        }
        throw error;
    }
};

export const deleteTeam = async (id: number): Promise<void> => {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.team_member.deleteMany({
                where: { id_team: id }
            });
            await tx.team.delete({
                where: { id }
            });
        });
    } catch (error: any) {
        if (error.code === databaseErrorCodes.RecordNotFound) {
            throw new NotFoundError("Team not found");
        } else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation) {
            throw new ForeignKeyConstraintError(
                "Cannot delete team: foreign key constraint violation"
            );
        }
        throw error;
    }
}