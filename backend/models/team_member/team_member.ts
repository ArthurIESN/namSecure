import prisma from "../../database/databasePrisma.js";
import {IMember} from "@namSecure/shared/types/member/member";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member";
import {ITeam} from "@namSecure/shared/types/team/team";
import {UniqueConstraintError} from "../../errors/database/UniqueConstraintError.js";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";


export const getAllTeamMembers = async() : Promise<ITeamMember[]> =>{
    try{
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
        console.error(error);
        throw new Error("Failed to get team members");
    }
}

export const getTeamByMemberId = async (idMember: number):Promise<number[]> => {
    try{
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

        return dbTeam.map(team => team.id_team);

    }catch (error){
        console.error(error);
        throw new Error("Failed to get teams by member id");
    }

}


export const getMembersOfGroup = async(idGroup: number) : Promise<IMember[]> =>{
    try{
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

        if (!dbTeamMember) {
            throw new Error("Failed to add member to group");
        }
    } catch (error: any) {
        console.error(error);
        if (error.code === databaseErrorCodes.UniqueConstraintViolation) {
            throw new UniqueConstraintError("Ce membre est déjà dans cette équipe.");
        }

        throw error;
    }
}


export const deleteTeamMember = async (id: number) : Promise<void> =>{
    try{
        console.log("ID TEAM_MEMBER TO DELETE :", id);
        const dbTeamMember  = await prisma.team_member.delete({
            where: {
               id: id
            }
        });

        if(!dbTeamMember){
            throw new Error("Member not found in this team");
        }
    }catch (error : any){
        console.error(error);
        throw error;
    }
}


export const updateTeamMember = async (id: number, accepted: boolean) : Promise<void> => {
    try {
        const existingTeamMember = await prisma.team_member.findUnique({
            where: { id: id }
        });

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
        console.error(error);
        throw error;
    }
}