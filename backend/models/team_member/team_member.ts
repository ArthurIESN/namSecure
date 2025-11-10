import prisma from "../../database/databasePrisma";

export const addMemberToGroup = async (id_group : number, id_member : number) : Promise<void> =>{
    try{
        const dbTeamMember  = await prisma.team_member.create({
            data: {
                accepted : false,
                id_team: id_group,
                id_member: id_member
            }
        });

        if(!dbTeamMember){
            throw new Error("Failed to add member to group");
        }
    }catch (error : any){
        console.error(error);
        throw error;
    }
}