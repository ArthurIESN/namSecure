import { Request, Response} from 'express';
import * as validationCodeModel from "@/models/validation_code/validation_code";
import {IValidationCode} from "@namSecure/shared/types/validation_code/validation_code";
import {NotFoundError} from "@/errors/NotFoundError";
import {ForeignKeyConstraintError} from "@/errors/database/ForeignKeyConstraintError";
import { hash } from '@/utils/hash/hash';

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationCode:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         code_hash:
 *           type: string
 *           example: "$2b$10$9Ot3DuUqKjrI0z8Q5Sm6Zu9KxY1zL2aB3cD4eF5gH6iJ7kL8mN9oP"
 *         expires_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-20T10:30:00Z"
 *         attempts:
 *           type: number
 *           example: 3
 *   responses:
 *     ValidationCodeList:
 *       description: List of validation codes
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ValidationCode'
 */


export const getValidationCodes = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { limit, offset, search }: { limit: number, offset: number, search: string} = req.validated;
        const validationCodes: IValidationCode[] = await validationCodeModel.getValidationCodes(limit, offset, search);
        res.status(200).send(validationCodes);
    }
    catch (error: any)
    {
        console.error("Error in getValidationCodes controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getValidationCode = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: { id: number } = req.validated;
        const validationCode: IValidationCode | null = await validationCodeModel.getValidationCode(id);
        if(validationCode)
        {
            res.status(200).json(validationCode);
        }
        else
        {
            res.status(404).json({ error: "Validation code not found" });
        }
    }
    catch (error: any)
    {
        console.error("Error in getValidationCode controller:", error);
    }
}

export const createValidationCode = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { code_hash, expires_at, attempts }: { code_hash: string, expires_at: Date, attempts: number } = req.validated;

        console.debug(code_hash, expires_at, attempts);

        const validationCode: IValidationCode =
        {
            id: 0, // dummy value. not used
            code_hash : await hash(code_hash),
            expires_at : expires_at,
            attempts : attempts
        };

        await validationCodeModel.createValidationCode(validationCode);
        res.status(201).json({ message: "Validation code created successfully" });
    }
    catch (error: any)
    {
        console.error("Error in createValidationCode controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateValidationCode = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id, code_hash, expires_at, attempts }: { id: number, code_hash: string, expires_at: Date, attempts: number } = req.validated;

        let hashedCode: string = "";
        console.debug(code_hash, expires_at, attempts);
        if(code_hash !== undefined && code_hash !== "")
        {
            hashedCode = await hash(code_hash);
        }

        const validationCode: IValidationCode =
        {
            id: id,
            code_hash : hashedCode,
            expires_at : expires_at,
            attempts : attempts
        };

        await validationCodeModel.updateValidationCode(validationCode);
        res.status(200).json({ message: "Validation code updated successfully" });
    }
    catch (error: any)
    {
        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }

        console.error("Error in updateValidationCode controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteValidationCode = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { id }: { id: number } = req.validated;

        await validationCodeModel.deleteValidationCode(id);
        res.status(200).json({ message: "Validation code deleted successfully" });
    }
    catch (error: any)
    {
        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else if(error instanceof ForeignKeyConstraintError)
        {
            res.status(409).json({ error: error.message });
        }

        console.error("Error in deleteValidationCode controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}