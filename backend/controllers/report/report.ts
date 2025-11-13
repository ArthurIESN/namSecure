import { Request, Response} from 'express';
import {IReport} from "@namSecure/shared/types/report/report.js";
import * as reportModel from "../../models/report/report.js";
import {MissingFieldsError} from "../../errors/MissingFieldsError.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {UniqueConstraintError} from "../../errors/database/UniqueConstraintError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";

export const getReports = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { limit, offset, search } = req.validated;
        const reports : IReport[]= await reportModel.getReports(limit, offset, search);
        res.status(200).send(reports);
    }
    catch (error)
    {
        console.error("Error in getReports controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getReport = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id } = req.validated;

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
    catch (error)
    {
        console.error("Error in getReport controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createReport = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { date, lat, lng, street,level,is_public,photo_path,id_member, id_type_danger} = req.validated;

        const report: IReport =
            {
                id: 0,
                date: date,
                lat: lat,
                lng: lng,
                street: street,
                level: level,
                is_public: is_public,
                photo_path: photo_path,
                member: {
                    id: id_member,
                },
                type_danger: {id: id_type_danger}
            }

        await reportModel.createReport(report);
        res.status(201).json({ message : "Report created"});
    }
    catch (error : any)
    {
        if (error instanceof MissingFieldsError)
        {
            res.status(400).json({ error: error.message });
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
        const {id, date, lat, lng, street,level,is_public,photo_path,id_member, id_type_danger} = req.validated;

        const report: IReport =
            {
                id: id,
                date: date,
                lat: lat,
                lng: lng,
                street: street,
                level: level,
                is_public: is_public,
                photo_path: photo_path,
                member: {id: id_member},
                type_danger: {id: id_type_danger}
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
        else
        {
            console.error("Error in deleteReport controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}