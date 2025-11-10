import prisma from "../../database/databasePrisma.js";
import {ITeam} from "@namSecure/shared/types/team/team";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";

interface UpdateTeamData {
    id: number;
    name: string;
    id_admin: number;
    id_report: number | null;
    members?: Array<{ id_member: number; accepted: boolean }>;
}

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

export const updateTeam = async (data: UpdateTeamData): Promise<ITeam> => {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Mettre à jour les champs de base de la team (remplacement complet)
            await tx.team.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    id_admin: data.id_admin,
                    id_report: data.id_report
                }
            });

            // 2. Supprimer TOUS les membres existants sauf l'admin
            await tx.team_member.deleteMany({
                where: {
                    id_team: data.id,
                    id_member: { not: data.id_admin }
                }
            });

            // 3. S'assurer que l'admin est dans team_member avec accepted: true
            const adminMember = await tx.team_member.findFirst({
                where: {
                    id_team: data.id,
                    id_member: data.id_admin
                }
            });

            if (adminMember) {
                await tx.team_member.update({
                    where: { id: adminMember.id },
                    data: { accepted: true }
                });
            } else {
                await tx.team_member.create({
                    data: {
                        id_team: data.id,
                        id_member: data.id_admin,
                        accepted: true
                    }
                });
            }

            // 4. Ajouter les nouveaux membres (si fournis)
            if (data.members && data.members.length > 0) {
                // Filtrer l'admin des membres à ajouter (déjà géré ci-dessus)
                const membersToAdd = data.members.filter(m => m.id_member !== data.id_admin);

                if (membersToAdd.length > 0) {
                    await tx.team_member.createMany({
                        data: membersToAdd.map(m => ({
                            id_team: data.id,
                            id_member: m.id_member,
                            accepted: m.accepted
                        })),
                        skipDuplicates: true
                    });
                }
            }

            // 5. Retourner la team mise à jour
            const updatedTeam = await tx.team.findUnique({
                where: { id: data.id },
                include: {
                    team_member: true,
                    admin: {
                        select: {
                            id: true
                        }
                    },
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