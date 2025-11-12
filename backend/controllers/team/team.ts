import {Request, Response} from "express";
import {ITeam} from "@namSecure/shared/types/team/team";
import * as teamModel from "../../models/team/team.js";


export const getTeams = async (req : Request, res : Response) : Promise<void> =>
{
    const { limit } = req.validated;
    try{
        const teams : ITeam[] = await teamModel.getTeams(limit);
        res.send(teams);
    }catch (error : any){
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

export const getTeam = async (req : Request, res : Response) : Promise<void> =>{
    const { id } = req.validated;
    try{
        const team : ITeam = await teamModel.getTeam(id);
        res.send(team);
    }catch (error : any){
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

export const createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, team_member, id_member } = req.validated;

        const adminId = id_member ?? req.user!.id;

        const newTeam: ITeam = await teamModel.createTeamWithMember(name, adminId, team_member);

        res.status(201).json(newTeam);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, id_member, id_report, members } = req.validated;

        const updatedTeam: ITeam = await teamModel.updateTeam({
            id,
            name,
            id_member,
            id_report,
            members
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
        const { id } = req.validated;

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