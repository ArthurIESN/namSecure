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
        const { date, lat, lng, street,level,photo_path,id_member, member_fn, member_ln, member_email, member_email_checked, member_id_checked, member_password, member_address, member_birthday, member_national_registry, id_type_danger, name_type_danger, is_used_type_danger, id_role, id_2fa, id_id_check, id_validation_code} = req.validated;

        const report: IReport =
            {
                id: 0,
                date: date,
                lat: lat,
                lng: lng,
                street: street,
                level: level,
                photo_path: photo_path,
                member: {
                    id: id_member,
                    first_name: member_fn,
                    last_name: member_ln,
                    email: member_email,
                    email_checked: member_email_checked,
                    id_checked: member_id_checked,
                    password: member_password,
                    password_last_update: date,
                    address: member_address,
                    birthday: member_birthday,
                    national_registry: member_national_registry,
                    created_at: date,
                    role : { id: id_role, name: "" },
                    twoFA: id_2fa ? { id: id_2fa, secret_key: "", is_enabled : false, created_at : date} : null,
                    id_check: id_id_check ? { id: id_id_check, card_front_id : "", card_back_id : ""} : null,
                    validation_code: id_validation_code ? {id: id_validation_code, code_hash: "", expires_at: date, attempts: 0}  : null,
                },
                type_danger: {id: id_type_danger, name: name_type_danger, is_used: is_used_type_danger}
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
        const {id, date, lat, lng, street,level,photo_path,id_member, member_fn, member_ln, member_email, member_email_checked, member_id_checked, member_password, member_address, member_birthday, member_national_registry, id_type_danger, name_type_danger, is_used_type_danger, id_role, id_2fa, id_id_check, id_validation_code} = req.validated;

        const report: IReport =
            {
                id: id,
                date: date,
                lat: lat,
                lng: lng,
                street: street,
                level: level,
                photo_path: photo_path,
                member: {
                    id: id_member,
                    first_name: member_fn,
                    last_name: member_ln,
                    email: member_email,
                    email_checked: member_email_checked,
                    id_checked: member_id_checked,
                    password: member_password,
                    password_last_update: date,
                    address: member_address,
                    birthday: member_birthday,
                    national_registry: member_national_registry,
                    created_at: date,
                    role : { id: id_role, name: "" },
                    twoFA: id_2fa ? { id: id_2fa, secret_key: "", is_enabled : false, created_at : date} : null,
                    id_check: id_id_check ? { id: id_id_check, card_front_id : "", card_back_id : ""} : null,
                    validation_code: id_validation_code ? {id: id_validation_code, code_hash: "", expires_at: date, attempts: 0}  : null,
                },
                type_danger: {id: id_type_danger, name: name_type_danger, is_used: is_used_type_danger}
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