import { Request, Response } from 'express';
import * as member_roleModel from '../../models/member_role/member_role.js';
import { IMemberRole } from "@namSecure/shared/types/member_role/member_role";
import { NotFoundError } from '../../errors/NotFoundError.js';
import { InvalidIdError } from "../../errors/InvalidIdError.js";
import { ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";
import { MissingFieldsError } from "../../errors/MissingFieldsError.js";

export const getMemberRoles = async (_req: Request, res: Response): Promise<void> =>
{
    try
    {
        const memberRoles : IMemberRole[] = await member_roleModel.getMemberRoles();
        res.send(memberRoles);
    }
    catch (error)
    {
        console.error("Error in getMemberRoles controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMemberRole = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id))
        {
            throw new InvalidIdError("Invalid role id");
        }

        const memberRole : IMemberRole | null = await member_roleModel.getMemberRole(id);
        if (memberRole)
        {
            res.send(memberRole);
        }
        else
        {
            res.status(404).json({ error: "Member role not found" });
        }
    }
    catch (error)
    {
        if(error instanceof InvalidIdError)
        {
            res.status(400).json({ error: error.message });
        }
        else
        {
            console.error("Error in getMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const createMemberRole = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { name } = req.body;

        if (!name)
        {
            throw new MissingFieldsError("Missing required fields");
        }

        const role : Omit<IMemberRole, "id"> =
        {
            name : name
        }

        const newRole: IMemberRole = await member_roleModel.createMemberRole(role);
        res.status(201).json(newRole);
    }
    catch (error : any)
    {
        if(error instanceof MissingFieldsError)
        {
            res.status(400).json({ error: error.message });
        }
        else
        {
            console.error("Error in createMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const updateMemberRole = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const id  = parseInt(req.body.id, 10);
        const { name } = req.body;

        if (!name)
        {
            throw new MissingFieldsError("Missing required fields");
        }

        if(isNaN(id))
        {
            throw new InvalidIdError("Invalid role id");
        }

        const role : IMemberRole =
        {
            id: id,
            name : name
        }

        await member_roleModel.updateMemberRole(role);
        res.status(204).send();
    }
    catch (error : any)
    {
        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else if(error instanceof MissingFieldsError || error instanceof InvalidIdError)
        {
            res.status(400).json({ error: error.message });
        }
        else
        {
            console.error("Error in updateMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const deleteMemberRole = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const id = parseInt(req.params.id, 10);

        await member_roleModel.deleteMemberRole(id);

        res.status(204).send();
    }
    catch (error : any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof InvalidIdError)
        {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof ForeignKeyConstraintError)
        {
            res.status(409).json({ error: error.message });
        }
        else
        {
            console.error("Error in deleteMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}