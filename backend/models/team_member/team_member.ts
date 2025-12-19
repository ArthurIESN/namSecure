import prisma from "../../database/databasePrisma.js";
import {IMember} from "@namSecure/shared/types/member/member";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member";
import {ITeam} from "@namSecure/shared/types/team/team";

export const getAllTeamMembers = async() : Promise<ITeamMember[]> =>{
    try{
        //@todo missing search, limit, offset
        const dbTeamMembers = await prisma.team_member.findMany({
            include: {
                member : true,
                team: true
            }
        });

        const teamMembers: ITeamMember[] = dbTeamMembers.map(tm => ({
            id: tm.id,
            accepted: tm.accepted,
            team: tm.team,
            member: tm.member
        }));

        return teamMembers;

    }catch (error : any){
        // @todo useless try catch
        console.error(error);
        throw new Error("Failed to get team members");
    }
}

export const getTeamByMember = async (idMember: number):Promise<number[]> => {
    try{
        //@todo missing member select, accepted needs to be false
        const dbTeam = await prisma.team_member.findMany(
            {
                where:{
                    id_member: idMember,
                    accepted: true
                },
                select:{
                    id_team: true,
                }
            }
        )

        //@todo useless .map
        return dbTeam.map(team => team.id_team);

    }catch (error){
        // @todo useless try catch
        console.error(error);
        throw new Error("Failed to get teams by member id");
    }

}


export const getMembersOfGroup = async(idGroup: number) : Promise<IMember[]> =>{
    try{
        //@todo accepted may be false ?
        //@todo do not include password directly from prisma not from .map
        //@todo missing team
        const dbTeamMembers = await prisma.team_member.findMany({
            where: {
                id_team: idGroup,
                accepted: true
            },
            include: {
                member : {
                    include: {
                        member_role: true,
                        member_2fa: true,
                        member_id_check: true,
                        validation_code: true
                    }
                }
            }
        });

        const members: IMember[] = dbTeamMembers.map(tm => ({
            id: tm.member.id,
            apple_id: tm.member.apple_id,
            first_name: tm.member.first_name,
            last_name: tm.member.last_name,
            email: tm.member.email,
            email_checked: tm.member.email_checked,
            id_checked: tm.member.id_checked,
            password: "",
            password_last_update: tm.member.password_last_update,
            address: tm.member.address,
            birthday: tm.member.birthday,
            national_registry: tm.member.national_registry,
            created_at: tm.member.created_at,
            role: tm.member.member_role,
            twoFA: tm.member.member_2fa,
            id_check: tm.member.member_id_check,
            validation_code: tm.member.id_validation_code
        }));

        return members;

    }catch (error : any){
        console.error(error);
        throw new Error("Failed to get members");
    }
}

export const createTeamMember = async (id_team: number, id_member: number, accepted: boolean = false) : Promise<void> => {
    try {
        const dbTeamMember = await prisma.team_member.create({
            data: {
                accepted: accepted,
                id_team: id_team,
                id_member: id_member
            }
        });

        //@todo useless check, prisma will throw an error if it fails
        if (!dbTeamMember) {
            throw new Error("Failed to add member to group");
        }
    } catch (error: any) {
        // @todo handle specific errors (foreign key, unique constraint, etc.)
        console.error(error);
        throw error;
    }
}


export const deleteTeamMember = async (id_group : number, id_member : number) : Promise<void> =>{
    try{
        const dbTeamMember  = await prisma.team_member.deleteMany({
            where: {
                id_team: id_group,
                id_member: id_member
            }
        });

        //@todo useless check, prisma will throw an error if it fails
        if(dbTeamMember.count === 0){
            throw new Error("Member not found in this team");
        }
    }catch (error : any){
        // @todo handle specific errors
        console.error(error);
        throw error;
    }
}
export const updateTeamMember = async (id: number, accepted: boolean) : Promise<void> => {
    try {
        //@todo useless check, prisma will throw an error if the record does not exist
        const existingTeamMember = await prisma.team_member.findUnique({
            where: { id: id }
        });

        //@todo useless check, prisma will throw an error if the record does not exist
        if (!existingTeamMember) {
            throw new Error(`Team member with id ${id} not found`);
        }

        await prisma.team_member.update({
            where: { id: id },
            data: {
                accepted: accepted
            }
        });
    } catch (error: any) {
        // @todo handle specific errors
        console.error(error);
        throw error;
    }
}