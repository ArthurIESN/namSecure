import { Request, Response } from 'express';
import * as memberModel from '../../models/member/member.js';
import { IMember } from '@namSecure/shared/types/member/member.js';
import { NotFoundError } from "../../errors/NotFoundError.js";
import { MissingFieldsError } from "../../errors/MissingFieldsError.js";
import { UniqueConstraintError } from "../../errors/database/UniqueConstraintError.js";
import { ForeignKeyConstraintError } from "../../errors/database/ForeignKeyConstraintError.js";

export const getMembers = async (req: Request, res: Response): Promise<void> =>
{
    const { limit } = req.validated;
    try
    {
        const members : IMember[] = await memberModel.getMembers(limit);
        res.send(members);
    }
    catch (error : any)
    {
        console.error("Error in getMembers controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMember = async (req: Request, res: Response): Promise<void> =>
{
    const { id } = req.validated;

    try
    {
        const member : IMember= await memberModel.getMember(id);

        res.send(member);
    }
    catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else
        {
            console.error("Error in getMember controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const createMember = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { apple_id, first_name, last_name, email, email_checked, id_checked, password, address, birthday, national_registry, id_role, id_2fa, id_id_check, id_validation_code } = req.validated

        const date = new Date();

        console.debug(first_name + " this is a test");

        const member: IMember =
        {
            id: 0, // Will be set by the database
            apple_id: apple_id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            email_checked: email_checked,
            id_checked: id_checked,
            password: password,
            password_last_update: date,
            address: address,
            birthday: birthday,
            national_registry: national_registry,
            created_at: date,
            role : { id: id_role, name: "" },
            twoFA: id_2fa ? { id: id_2fa, secret_key: "", is_enabled : false, created_at : date} : null,
            id_check: id_id_check ? { id: id_id_check, card_front_id : "", card_back_id : ""} : null,
            validation_code: id_validation_code ? {id: id_validation_code, code_hash: "", expires_at: date, attempts: 0}  : null,
        }

        console.debug("Creating member with data:", member);
        await memberModel.createMember(member);
        res.status(201).json({ message : "Member created"});
    }
    catch (error: unknown)
    {
        if(error instanceof MissingFieldsError)
        {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError)
        {
            res.status(409).json({ error: error.message });
        }
        else
        {
            console.error("Error in createMember controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const updateMember = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id, apple_id, first_name, last_name, email, email_checked, id_checked, password_last_update, address, birthday, national_registry, id_role, id_2fa, id_id_check, id_validation_code } = req.validated;

        const member: IMember =
        {
            id: id,
            apple_id: apple_id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            email_checked: email_checked,
            id_checked: id_checked,
            password: "", // Password is not updated here
            password_last_update: password_last_update,
            address: address,
            birthday: birthday,
            national_registry: national_registry,
            created_at: new Date(), // created_at is not updated here
            role : { id: id_role, name: "" },
            twoFA: id_2fa ? { id: id_2fa, secret_key: "", is_enabled : false, created_at : new Date()} : null,
            id_check: id_id_check ? { id: id_id_check, card_front_id : "", card_back_id : ""} : null,
            validation_code: id_validation_code ? {id: id_validation_code, code_hash: "", expires_at: new Date(), attempts: 0}  : null,
        }

        await memberModel.updateMember(member);
        res.status(200).json({ message: "Member updated successfully" });
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
            console.error("Error in updateMember controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export const deleteMember = async (req: Request, res: Response): Promise<void> =>
{
    const { id } = req.validated;

    try
    {
        await memberModel.deleteMember(id);
        res.status(200).json({ message: "Member deleted successfully" });
    }
    catch (error: any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else
        {
            console.error("Error in deleteMember controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}