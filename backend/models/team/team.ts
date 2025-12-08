import prisma from "../../database/databasePrisma.js";
import {ITeam} from "@namSecure/shared/types/team/team";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member";

interface UpdateTeamData {
    id: number;
    name: string;
    id_member: number;
    id_report: number | null;
    team_member?: ITeamMember[];
}

export const getTeams = async (limit : number): Promise<ITeam[]> => {
    const dbTeams = await prisma.team.findMany({
        include : {
            team_member : true,
            member: true,
            report: true
        },
        take : limit,
    })

    if(!dbTeams){
        throw new Error("Team not found");
    }

    return dbTeams;
}

export const getMyTeams = async (userId: number, limit : number): Promise<ITeam[]> => {
    const dbTeams = await prisma.team.findMany({
        where: {
            OR: [
                { id_admin: userId },
                {
                    team_member: {
                        some: {
                            id_member: userId
                        }
                    }
                }
            ]
        },
        include : {
            team_member : true,
            member: true,
            report: true
        },
        take : limit,
    })

    if(!dbTeams){
        throw new Error("Team not found");
    }

    return dbTeams;
}

export const getTeam = async (id : number): Promise<ITeam> => {
    const dbTeam = await prisma.team.findUnique({
        where : {
            id : id
        },
        include : {
            member:
                {
                    include:
                        {
                            member_role: true,
                            member_2fa: true,
                            member_id_check: true,
                            validation_code: true
                        }
                },
            report: true,
            team_member: {
                include: {
                    member: true
                }
            }
        }
    });

    if(!dbTeam){
        throw new Error("Team not found");
    }

    return dbTeam;

}


export const createTeamWithMember = async (name: string, id_member: number, team_member: ITeamMember[]): Promise<ITeam> => {
    return prisma.$transaction(async (tx) => {
        const newTeam = await tx.team.create({
            data: {
                name: name,
                id_admin: id_member,
                id_report: null,
            }
        });

        if(team_member.find(member => member.member !== id_member))
        {
            team_member.push({
                id: 0,
                member: id_member,
                accepted: true,
            });
        }

        await tx.team_member.createMany({
            skipDuplicates: true,
            data: team_member.map(teamMember => ({
                id_team: newTeam.id,
                id_member: teamMember.member,
                accepted: teamMember.accepted
            }))
        })

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




            // @todo changer le nom de id_member
            const test = data.team_member?.find(m => m.member === data.id_member); {}
            console.log(test)
            console.log(data.team_member);
            if(test){
                test.accepted = true;
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