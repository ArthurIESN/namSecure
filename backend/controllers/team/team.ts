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
        const { name, memberIds } = req.body; // @todo req.validated => validation de données middleware

        // @todo get id_admin from authenticated user session/token
        const id_admin = 1;

        if (!id_admin) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const newTeam: ITeam = await teamModel.createTeamWithMember(name, id_admin, memberIds);

        res.status(201).json(newTeam);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}