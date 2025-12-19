import { Request, Response} from 'express';
import {IReport} from "@namSecure/shared/types/report/report.js";
import {ITypeDanger} from "@namSecure/shared/types/type_danger/type_danger.js";
import * as reportModel from "../../models/report/report.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {UniqueConstraintError} from "../../errors/database/UniqueConstraintError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";
import { getTeamByMember } from '@/models/team_member/team_member';
import { saveImage } from '@/utils/upload/upload';
import { v4 as uuidv4 } from 'uuid';
//@todo fix imports

export const getReports = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { limit, offset, search } = req.validated;
        const reports : IReport[]= await reportModel.getReports(limit, offset, search);
        res.status(200).send(reports);
    }
    catch (error : any)
    {
        console.error("Error in getReports controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getReport = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id }: {id:number} = req.validated;

        const report : IReport | null = await reportModel.getReport(id);
        if(report)
        {
            res.status(200).json(report);
        }
        else
        {
            res.status(404).json({ error: "Report not found" });
        }
    }
    catch (error : any)
    {
        console.error("Error in getReport controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createReport = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { date, lat, lng, street, level, is_public, for_police, photo_path, id_member, id_type_danger}:
            { date?: Date, lat: number, lng: number, street: string, level: number, is_public: boolean,
                for_police: boolean, photo_path?: string, id_member?: number, id_type_danger: number } = req.validated;

        const reportMemberId : number = id_member ?? req.user!.id;
        const reportDate : Date = date ?? new Date();

        let photo_path: string | null = null;
        if (req.file)
        {
            const fileName: string = uuidv4();
            const destPath: string = "uploads/reports/";
            //@todo handle error
            await saveImage(req.file.buffer, fileName, destPath);
            photo_path = `${fileName}.jpeg`;
        }

        const report: IReport =
        {
            id: 0,
            date: reportDate,
            lat: lat,
            lng: lng,
            street: street,
            level: level,
            is_public: is_public,
            for_police: for_police,
            photo_path: photo_path ?? null,
            member: reportMemberId,
            type_danger: id_type_danger
        }

        const createdReport : IReport = await reportModel.createReport(report);

        console.log("Ceci est le full report :", createdReport);
        if (createdReport.is_public) {
            global.wsService.broadcastReportPublic({
                type: 'report',
                street: createdReport.street,
                icon: (createdReport.type_danger as ITypeDanger).icon,
                memberId : reportMemberId,
                isPublic: createdReport.is_public,
                id: createdReport.id,
                lat: Number(createdReport.lat),
                lng: Number(createdReport.lng),
                level: createdReport.level,
                typeDanger: (createdReport.type_danger as ITypeDanger).name,
            });

        } else {
            const message = {
                type: 'report',
                memberId : reportMemberId,
                street: createdReport.street,
                icon: (createdReport.type_danger as ITypeDanger).icon,
                isPublic: createdReport.is_public,
                id: createdReport.id,
                lat: Number(createdReport.lat),
                lng: Number(createdReport.lng),
                level: createdReport.level,
                typeDanger: (createdReport.type_danger as ITypeDanger).name,
            }


            const teams = await getMyTeams(req.user!.id,2);

            const teamIds =  teams.map(team => team.id);

            teamIds.forEach(teamId => {
                global.wsService.broadcastReportToTeam(teamId,message);
            })
        }

        res.status(201).json({ message : "Report created", reportId: createdReport.id});
    }
    catch (error : any)
    {
        if (error instanceof UniqueConstraintError)
        {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof ForeignKeyConstraintError)
        {
            res.status(409).json({ error: error.message });
        }
        else
        {
            console.error("Error in createReport controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const updateReport = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const {id, date, lat, lng, street,level,is_public,for_police,photo_path,id_member, id_type_danger} :
            { id: number, date: Date, lat: number, lng: number, street: string, level: number,
                is_public: boolean, for_police: boolean, photo_path?: string, id_member: number, id_type_danger: number } = req.validated;

        const report: IReport =
            {
                id: id,
                date: date,
                lat: lat,
                lng: lng,
                street: street,
                level: level,
                is_public: is_public,
                for_police: for_police,
                photo_path: photo_path ?? null,
                member: id_member,
                type_danger: id_type_danger
            }

        await reportModel.updateReport(report);
        res.status(200).json({ message : "Report updated"});
    }
    catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError)
        {
            res.status(409).json({ error: error.message });
        }
        else
        {
            console.error("Error in updateReport controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export const deleteReport = async (req: Request, res: Response): Promise<void> =>
{
    const { id } = req.validated;

    try
    {
        await reportModel.deleteReport(id);
        res.status(200).json({ message: "Report deleted successfully" });
    }
    catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof ForeignKeyConstraintError)
        {
            res.status(409).json({ error: error.message });
        }
        else
        {
            console.error("Error in deleteReport controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const getReportsForUser = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const userId = req.user?.id;

        if (!userId)
        {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const reports: IReport[] = await reportModel.getReportsForUser(userId);
        res.status(200).json(reports);
    }
    catch (error : any)
    {
        console.error("Error in getReportsForUser controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}