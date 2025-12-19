import * as teamMemberModel from "@/models/team_member/team_member.js";
import { ITeamMember } from "@namSecure/shared/types/team_member/team_member.js";
import { Request, Response } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         accepted:
 *           type: boolean
 *           example: true
 *         team:
 *           type: number
 *           nullable: true
 *           example: 1
 *         member:
 *           type: number
 *           example: 5
 *   responses:
 *     TeamMemberList:
 *       description: List of team members
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TeamMember'
 *     UnauthorizedError:
 *       description: Unauthorized - missing or invalid JWT token
 */


export const getAllTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit, offset, search }: {limit: number, offset: number, search: string} = req.validated;
        const teamMembers: ITeamMember[] = await teamMemberModel.getAllTeamMembers(limit, offset || 0, search || "");
        res.status(200).json(teamMembers);
    } catch (error: any) {
        console.error("Error in getAllTeamMembers controller:", error);
        res.status(500).json({ error: "Failed to fetch team members" });
    }
}

export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id }: {id: number} = req.validated;
        await teamMemberModel.deleteTeamMember(id);
        res.status(200).json({ message: "Team member deleted successfully" });
    }catch (error: any) {
        console.error("Error in deleteTeamMember controller:", error);
        res.status(500).json({ error: "Failed to delete team member" });
    }
}

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, accepted }: {id: number, accepted: boolean} = req.validated;

        await teamMemberModel.updateTeamMember(id, accepted);
        res.status(200).json({ message: "Team member updated successfully" });
    } catch (error: any) {
        //@todo handle specific errors !!!!!
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
        const { id_team, id_member, accepted }: {id_team: number, id_member: number, accepted: boolean} = req.validated;
        await teamMemberModel.createTeamMember(id_team, id_member, accepted);
        res.status(201).json({ message: "Team member created successfully" });
    } catch (error: any) {
        //@todo handle specific errors !!!!!
        console.error("Error in createTeamMember controller:", error);
        res.status(400).json({ error: error.message });
    }
}