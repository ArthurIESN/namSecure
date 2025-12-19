import { Request, Response } from 'express';
import * as member_roleModel from '@/models/member_role/member_role';
import { IMemberRole } from "@namSecure/shared/types/member_role/member_role";
import { NotFoundError } from '@/errors/NotFoundError';
import { ForeignKeyConstraintError} from "@/errors/database/ForeignKeyConstraintError";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token in Authorization header
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *       description: JWT token in cookie
 *   schemas:
 *     MemberRole:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Admin"
 *   responses:
 *     MemberRoleCreated:
 *       description: Member role created successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Member role created successfully"
 *     MemberRoleUpdated:
 *       description: Member role updated successfully
 *     MemberRoleDeleted:
 *       description: Member role deleted successfully
 *     MemberRoleList:
 *       description: List of member roles
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/MemberRole'
 *     UnauthorizedError:
 *       description: Unauthorized - missing or invalid JWT token or insufficient admin permissions
 */

export const getMemberRoles = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { limit, offset, search } = req.validated;

        const memberRoles : IMemberRole[] = await member_roleModel.getMemberRoles(limit, offset, search);
        res.status(200).json(memberRoles);
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
        const { id }: {id: number} = req.validated;

        const memberRole : IMemberRole | null = await member_roleModel.getMemberRole(id);
        if (memberRole)
        {
            res.status(200).json(memberRole);
        }
        else
        {
            res.status(404).json({ error: "Member role not found" });
        }
    }
    catch (error)
    {
        console.error("Error in getMemberRole controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createMemberRole = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { name }: { name: string } = req.validated;

        const role: IMemberRole =
        {
            id: 0, // dummy value. not used
            name : name
        }

        await member_roleModel.createMemberRole(role);
        res.status(201).json({ message: "Member role created successfully" });
    }
    catch (error: any)
    {
        console.error("Error in createMemberRole controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateMemberRole = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id, name }: { id: number, name: string} = req.validated;

        const role : IMemberRole =
        {
            id: id,
            name : name
        }

        await member_roleModel.updateMemberRole(role);

        res.status(204).json({ message: "Member role updated successfully" });
    }
    catch (error: any)
    {
        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
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
        const { id }: { id: number} = req.validated;

        await member_roleModel.deleteMemberRole(id);

        res.status(204).json({ message: "Member role deleted successfully" });
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
            console.error("Error in deleteMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}