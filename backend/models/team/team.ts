import prisma from "../../database/databasePrisma.js";
import {ITeam} from "@namSecure/shared/types/team/team";


export const getTeams = async (limit : number): Promise<ITeam[]> => {
    const dbTeams = await prisma.team.findMany({
        include : {
            team_member : true,
            admin:true,
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
            admin:
                {
                    include:
                        {
                            member_role: true,
                            member_2fa: true,
                            member_id_check: true,
                            validation_code: true
                        }
                },
            report: true
        }
    });

    if(!dbTeam){
        throw new Error("Team not found");
    }

    return dbTeam;

}


export const createTeamWithMember = async (name: string, id_admin: number, memberIds?: number[]): Promise<ITeam> => {
    return prisma.$transaction(async (tx) => {
        const newTeam = await tx.team.create({
            data: {
                name: name,
                id_admin: id_admin,
                id_report: null,
            }
        });

        await tx.team_member.create({
            data: {
                id_team: newTeam.id,
                id_member: id_admin,
                accepted: true
            }
        });

        if (memberIds && memberIds.length > 0) {
            const otherMembers = memberIds.filter(id => id !== id_admin);

            if (otherMembers.length > 0) {
                await tx.team_member.createMany({
                    data: otherMembers.map(id_member => ({
                        id_team: newTeam.id,
                        id_member: id_member,
                        accepted: false
                    }))
                });
            }
        }

        const teamWithRelations = await tx.team.findUnique({
            where: { id: newTeam.id },
            include: {
                team_member: {
                    include: {
                        member: true
                    }
                },
                report: true,
                admin: true
            }
        });

        if (!teamWithRelations) {
            throw new Error("Failed to create team");
        }

        return teamWithRelations;
    });
}