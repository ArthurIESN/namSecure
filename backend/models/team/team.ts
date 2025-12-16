import prisma from "../../database/databasePrisma.js";
import {ITeam} from "@namSecure/shared/types/team/team";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member";
import {id} from "effect/Fiber";

interface UpdateTeamData {
    id: number;
    name: string;
    id_member: number;
    id_report: number | null;
    team_member?: ITeamMember[];
}

export const getTeams = async (limit : number): Promise<ITeam[]> => {
    const dbTeams= await prisma.team.findMany({
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
    })

    if(!dbTeams){
        console.error("Error fetching teams from database");
        throw new Error("Team not found");
    }

     return  dbTeams.map(team => ({
        id: team.id,
        name: team.name,
        id_admin: team.id_admin,
        admin: {
            ...team.member,
            password: '',
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
         team_member: team.team_member,
     }))
}

export const getMyTeams = async (userId: number, limit : number): Promise<ITeam[]> => {
    const dbTeams = await prisma.team.findMany({
        where: {
            OR: [
                { id_admin: userId },
                {
                    team_member: {
                        some: {
                            id_member: userId,
                            accepted: true,
                        }
                    }
                }
            ]
        },
        include : {
            team_member : {
                include: {
                    member: true
                }
            },
            member: true,
            report: true
        },
        take : limit,
    })

    if(!dbTeams){
        throw new Error("Team not found");
    }



    return dbTeams.map(team => ({
        id: team.id,
        name: team.name,
        id_admin: team.id_admin,
        admin: {
            ...team.member,
            password: '',
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
        team_member: team.team_member,
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
                    member: true // Retirer le password
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


export const createTeamWithMember = async (name: string, id_member: number, team_member: ITeamMember[]): Promise<void> =>
{

    console.log("creating team", name, id, team_member);

    prisma.$transaction(async (tx) => {
        const newTeam = await tx.team.create({
            data: {
                name: name,
                id_admin: id_member,
                id_report: null,
            }
        });

        if(!team_member.find(member => member.member === id_member))
        {
            team_member.push({
                id: 0,
                member: id_member,
                accepted: true,
            });
        }

        console.debug("team members to add :", team_member);

        await tx.team_member.createMany({
            skipDuplicates: true,
            data: team_member.map(teamMember => ({
                id_team: newTeam.id,
                id_member: teamMember.member as number,
                accepted: teamMember.accepted
            }))
        })

        // @todo WHY ?????
        const teamWithRelations = await tx.team.findUnique({
            where: { id: newTeam.id },
            include: {
                team_member: {
                    include: {
                        member: {
                            select : {
                                id : true
                            }
                        }
                    }
                },
                report: true,
                member: {
                    select : {
                        id : true
                    }
                }
            }
        });

        if (!teamWithRelations) {
            throw new Error("Failed to create team");
        }

        return teamWithRelations;
    });
}


// @todo : faire en sorte que si on change l'admin le membre ne disparaisse pas des membres de l'equipe
// @todo : mettre a jour la db avec prisma

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




            const adminMember = data.team_member?.find(m => m.member === data.id_member);
            if(adminMember){
                adminMember.accepted = true;
            }else{
                data.team_member!.push({
                    id:0,
                    member: data.id_member,
                    accepted: true
                });
            }
            await tx.team_member.createMany({
                data: data.team_member!.map(m => ({
                    id_team: data.id,
                    id_member: m.member,
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