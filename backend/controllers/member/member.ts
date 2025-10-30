import { Request, Response } from 'express';
import * as memberModel from '../../models/member/member.js';
import { IMember } from '@namSecure/shared/types/member/member.js';
import { NotFoundError } from "../../errors/NotFoundError.js";
import { MissingFieldsError } from "../../errors/MissingFieldsError.js";
import { UniqueConstraintError } from "../../errors/database/UniqueConstraintError.js";
import { isValidNationalRegistryNumber } from "../../utils/nationalRegistry/nationalRegistry.js";
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
        const { first_name, last_name, email, email_checked, id_checked, password, address, birthday, national_registry, id_role, id_member_2fa, id_member_id_check, id_validation_code } = req.validated;
    /*
        const requiredFields = ['email', 'password', 'address', 'id_member_role'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if(missingFields.length > 0) throw new MissingFieldsError(`Missing required fields: ${missingFields.join(", ")}`);

        if(id_checked)
        {
            const requiredIdCheckFields = ['first_name', 'last_name', 'birthday', 'national_registry'];
            const missingIdCheckFields = requiredIdCheckFields.filter(field => !req.body[field]);

            if(missingIdCheckFields.length > 0) throw new MissingFieldsError(`Missing required fields. The following fields are required for an ID-checked user: ${missingIdCheckFields.join(", ")}`);
        }

        if(birthday && isNaN(new Date(birthday).getTime())) throw new MissingFieldsError("Invalid birthday date format");

        if(national_registry && !isValidNationalRegistryNumber(national_registry)) throw new MissingFieldsError("Invalid national registry number");
        */
        const date = new Date();

        const member: IMember =
        {
            id: 0, // Will be set by the database
            first_name: first_name || null,
            last_name: last_name || null,
            email: email,
            email_checked: !!email_checked,
            id_checked: !!id_checked,
            password: password,
            password_last_update: date,
            address: address,
            birthday: birthday ? new Date(birthday) : null,
            national_registry: national_registry || null,
            created_at: date,
            role : { id: id_role, name: "" }, // name will not be used here
            twoFA: id_member_2fa ? { id: id_member_2fa, secret_key: "", is_enabled : false, created_at : date} : null,
            id_check: id_member_id_check ? { id: id_member_id_check, card_front_id : "", card_back_id : ""} : null,
            id_validation_code: id_validation_code || null, //@TODO check this
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