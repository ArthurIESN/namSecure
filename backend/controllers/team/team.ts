import {Request, Response} from "express";
import {ITeam} from "@namSecure/shared/types/team/team";
import * as teamModel from "@/models/team/team.js";
import {ITeamMember} from "@namSecure/shared/types/team_member/team_member.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Team Alpha"
 *         admin:
 *           type: number
 *           example: 5
 *         report:
 *           type: number
 *           nullable: true
 *           example: 10
 *   responses:
 *     TeamList:
 *       description: List of teams
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Team'
 *     UnauthorizedError:
 *       description: Unauthorized - missing or invalid JWT token
 */


export const getTeams = async (req : Request, res : Response) : Promise<void> =>
{
    const { limit, offset, search}: {limit: number, offset: number, search: string, } = req.validated;
    try{
        const teams : ITeam[] = await teamModel.getTeams(limit, offset, search || "");
        res.status(200).json(teams);
    }catch (error : any){
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

export const getMyTeams = async (req : Request, res : Response) : Promise<void> =>
{
    const { limit }: {limit: number} = req.validated;
    const userId: number = req.user!.id;
    try{
        const myTeams : ITeam[] = await teamModel.getMyTeams(userId, limit);
        res.status(200).json(myTeams);
    }catch (error : any){
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

export const getTeam = async (req : Request, res : Response) : Promise<void> =>{
    const { id } : {id: number}= req.validated;
    try{
        const team : ITeam = await teamModel.getTeam(id);
        res.status(200).json(team);
    }catch (error : any){
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

export const createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, team_member, id_member }: {name: string, team_member: ITeamMember[], id_member: number} = req.validated;

        const adminId: number = id_member ?? req.user!.id;

        const newTeam: ITeam = await teamModel.createTeamWithMember(name, adminId, team_member);

        res.status(201).json(newTeam);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, id_member, id_report, team_member}: {
            id: number,
            name: string,
            id_member: number,
            id_report: number,
            team_member: ITeamMember[]
        } = req.validated;

        const updatedTeam: ITeam = await teamModel.updateTeam({
            id,
            name,
            id_member,
            id_report,
            team_member
        });

        res.status(200).json(updatedTeam);
    } catch (error: any) {
        console.error(error);
        if (error.message === "Team not found") {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes("foreign key constraint")) {
            res.status(400).json({ error: "Invalid reference to member or report" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id }: {id : number} = req.validated;

        await teamModel.deleteTeam(id);

        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        if (error.message === "Team not found") {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes("foreign key constraint")) {
            res.status(400).json({ error: "Cannot delete team: foreign key constraint violation" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}