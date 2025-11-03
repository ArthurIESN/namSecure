import {ITeam} from "@namSecure/shared/types/team/team";
import prisma from "../../database/databasePrisma.js";

export const getTeams = async (limit : number): Promise<ITeam[]> => {
    const dbTeams = await prisma.team.findMany({
        include : {
            member: true,
            report: true
        },
        take : limit,
    });

    const teams : ITeam[] = dbTeams.map(t => ({
        id : t.id,
        name : t.name,
        admin : t.member,
        report : t.report,
    }));
}