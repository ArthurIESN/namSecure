import * as teamMemberModel from "../../models/team_member/team_member.js";
import { Request, Response } from "express";


export const getAllTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const teamMembers = await teamMemberModel.getAllTeamMembers();
        res.status(200).json(teamMembers);
    } catch (error: any) {
        console.error("Error in getAllTeamMembers controller:", error);
        res.status(500).json({ error: "Failed to fetch team members" });
    }
}

export const getMembersOfGroup = async (req: Request, res: Response): Promise<void> => {
    try{
        const { idGroup } = req.validated;
        const members = await teamMemberModel.getMembersOfGroup(idGroup);
        res.status(200).json(members);
    }catch (error: any) {
        console.error("Error in getMemberOfGroup controller:", error);
        res.status(500).json({ error: "Failed to fetch members of group" });
    }
}

export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id_group, id_member } = req.validated;
        await teamMemberModel.deleteTeamMember(id_group, id_member);
        res.status(200).json({ message: "Team member deleted successfully" });
    }catch (error: any) {
        console.error("Error in deleteTeamMember controller:", error);
        res.status(500).json({ error: "Failed to delete team member" });
    }
}

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, accepted } = req.validated;

        await teamMemberModel.updateTeamMember(id, accepted);
        res.status(200).json({ message: "Team member updated successfully" });
    } catch (error: any) {
        console.error("Error in updateTeamMember controller:", error);
        if (error.message?.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to update team member" });
        }
    }
}


export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_team, id_member, accepted } = req.validated;

        await teamMemberModel.createTeamMember(id_team, id_member, accepted);
        res.status(201).json({ message: "Team member created successfully" });
    } catch (error: any) {
        console.error("Error in createTeamMember controller:", error);
        res.status(500).json({ error: "Failed to create team member" });
    }
}