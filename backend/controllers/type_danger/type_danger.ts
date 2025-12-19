import { Request, Response} from 'express';
import * as typeDangerModel from "@/models/type_danger/type_danger.js";
import {ITypeDanger} from "@namSecure/shared/types/type_danger/type_danger";
import {NotFoundError} from "@/errors/NotFoundError";
import {ForeignKeyConstraintError} from "@/errors/database/ForeignKeyConstraintError";

/**
 * @swagger
 * components:
 *   schemas:
 *     TypeDanger:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Assault"
 *         icon:
 *           type: string
 *           example: "assault.fill"
 *         is_used:
 *           type: boolean
 *           example: true
 *   responses:
 *     TypeDangerList:
 *       description: List of danger types
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TypeDanger'
 */

export const getTypeDangers = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { limit, offset, search }: { limit: number, offset: number, search: string } = req.validated;
        const typeDangers : ITypeDanger[]= await typeDangerModel.getTypeDangers(limit, offset, search);
        res.status(200).send(typeDangers);
    }
    catch (error : any)
    {
        console.error("Error in getTypeDangers controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getTypeDangersUsed = async (_req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const typeDangers : ITypeDanger[]= await typeDangerModel.getTypeDangersUsed();
        res.status(200).send(typeDangers);
    }
    catch (error : any)
    {
        console.error("Error in getTypeDangersUsed controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getTypeDanger = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id }: { id: number } = req.validated;

        const typeDanger : ITypeDanger | null = await typeDangerModel.getTypeDanger(id);
        if(typeDanger)
        {
            res.status(200).json(typeDanger);
        }
        else
        {
            res.status(404).json({ error: "TypeDanger not found" });
        }
    }
    catch (error : any)
    {
        console.error("Error in getTypeDanger controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createTypeDanger = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { name, icon, is_used }: { name: string, icon: string, is_used: boolean } = req.validated;

        const typeDanger: ITypeDanger =
        {
            id: 0,
            name : name,
            icon : icon,
            is_used: is_used
        }
        await typeDangerModel.createTypeDanger(typeDanger);
        res.status(201).json({message : "Team member created successfully"});
    }
    catch (error : any)
    {
        console.error("Error in createTypeDanger controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateTypeDanger = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id, name, icon, is_used }: { id: number, name: string, icon: string, is_used: boolean } = req.validated;

        const typeDanger: ITypeDanger =
        {
            id: id,
            name : name,
            icon : icon,
            is_used : is_used
        }

        await typeDangerModel.updateTypeDanger(typeDanger);
        res.status(204).json({message: "TypeDanger updated successfully"});
    }
    catch (error : any)
    {
        if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else
        {
            console.error("Error in updateTypeDanger controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const deleteTypeDanger = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id }: { id: number } = req.validated;

        await typeDangerModel.deleteTypeDanger(id);
        res.status(204).json({ message: "TypeDanger deleted successfully" });
    }
    catch (error : any)
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
            console.error("Error in deleteTypeDanger controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}