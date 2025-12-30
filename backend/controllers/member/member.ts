import { Request, Response } from 'express';
import * as memberModel from '@/models/member/member';
import { IMember } from '@namSecure/shared/types/member/member';
import { NotFoundError } from "@/errors/NotFoundError";
import { UniqueConstraintError } from "@/errors/database/UniqueConstraintError";
import { ForeignKeyConstraintError } from "@/errors/database/ForeignKeyConstraintError";
import {hash} from "@/utils/hash/hash";
import {IAuthMember, IAuthUser} from "@/types/user/user";
import {IAuthUserInfo} from "@namSecure/shared/types/auth/auth";

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
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         apple_id:
 *           type: string
 *           nullable: true
 *           example: "com.apple.123456"
 *         first_name:
 *           type: string
 *           nullable: true
 *           example: "John"
 *         last_name:
 *           type: string
 *           nullable: true
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         email_checked:
 *           type: boolean
 *           example: true
 *         id_checked:
 *           type: boolean
 *           example: false
 *         password_last_update:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         address:
 *           type: string
 *           example: "123 Main St, City"
 *         birthday:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "1990-05-20"
 *         national_registry:
 *           type: string
 *           nullable: true
 *           example: "90052012345678"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-10T08:00:00Z"
 *         photo_path:
 *           type: string
 *           nullable: true
 *           example: "profile/user_1_profile.jpg"
 *         role:
 *           type: number
 *           nullable: false
 *           example: 1
 *         twoFA:
 *           type: number
 *           nullable: true
 *           example: 1
 *         id_check:
 *           type: number
 *           nullable: true
 *           example: 1
 *         validation_code:
 *           type: number
 *           nullable: true
 *           example: 1
 *     AuthUserInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         address:
 *           type: string
 *           example: "123 Main St, City"
 *         photoName:
 *           type: string
 *           nullable: true
 *           example: "user_1_profile.jpg"
 *         photoPath:
 *           type: string
 *           nullable: true
 *           example: "http://localhost:3000/profiles/user_1_profile.jpg"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         emailVerified:
 *           type: boolean
 *           example: true
 *         idVerified:
 *           type: boolean
 *           example: false
 *         twoFactorEnabled:
 *           type: boolean
 *           example: true
 *         twoFactorValidated:
 *           type: boolean
 *           example: true
 *   responses:
 *     MemberList:
 *       description: List of members
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Member'
 *     MemberCreated:
 *       description: Member created successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Member created"
 *     MemberUpdated:
 *       description: Member updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Member updated successfully"
 *     MemberDeleted:
 *       description: Member deleted successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Member deleted successfully"
 *     AuthUserInfoResponse:
 *       description: Current user information
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthUserInfo'
 *     UnauthorizedError:
 *       description: Unauthorized - missing or invalid JWT token or insufficient admin permissions
 */

export const me = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const user: IAuthUser = req.user as IAuthUser;
        const member: IAuthMember = req.member as IAuthMember;

        const baseUrl: string = `${req.protocol}://${req.get('host')}`;
        const uploadsPath: string | undefined = process.env.UPLOADS_BASE_PATH;

        const photoUrl: string = member.photo_path
            ? `${baseUrl}${uploadsPath}/${member.photo_path}`
            : "";

        const userInfo: IAuthUserInfo =
            {
                id: user.id,
                firstName : member.first_name || "",
                lastName : member.last_name || "",
                address : member.address || "",
                photoPath : photoUrl || "",
                photoName : member.photo_path || "",
                email: user.email,
                emailVerified: member.email_checked,
                idVerified: member.id_checked,
                twoFactorEnabled: member.member_2fa ? member.member_2fa.is_enabled : false,
                twoFactorValidated: user.twoFactorVerified
            }

        res.status(200).json(userInfo);
    }
    catch (error: any)
    {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getMembers = async (req: Request, res: Response): Promise<void> =>
{
    const { limit, offset, search }: {limit: number, offset: number, search: string} = req.validated;
    try
    {
        const members: IMember[] = await memberModel.getMembers(limit, offset, search);
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
    const { id }: { id: number} = req.validated;

    try
    {
        const member: IMember= await memberModel.getMember(id);

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
        const { apple_id, first_name, last_name, email, email_checked, id_checked, password, address, birthday, national_registry, id_role, id_2fa, id_id_check, id_validation_code, photo_path, created_at, password_last_update }: { apple_id: string, first_name: string, last_name: string, email: string, email_checked: boolean, id_checked: boolean, password: string, address: string, birthday: Date, national_registry: string, id_role: number, id_2fa?: number, id_id_check?: number, id_validation_code?: number, photo_path: string, created_at: Date, password_last_update: Date } = req.validated;

        let hashedPassword: string = await hash(password);

        const member: IMember =
        {
            id: 0,
            apple_id: apple_id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            email_checked: email_checked,
            id_checked: id_checked,
            password: hashedPassword,
            password_last_update: password_last_update,
            address: address,
            birthday: birthday,
            national_registry: national_registry,
            created_at: created_at,
            role : id_role,
            photo_path : photo_path,
            twoFA: id_2fa ?? null,
            id_check: id_id_check ?? null,
            validation_code: id_validation_code ?? null
        }

        await memberModel.createMember(member);
        res.status(201).json({ message : "Member created"});
    }
    catch (error: any)
    {
        if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError)
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
        const { id, apple_id, first_name, last_name, email, email_checked, id_checked, password, password_last_update, created_at, address, birthday, national_registry, id_role, id_2fa, id_id_check, id_validation_code, photo_path }: { id: number, apple_id: string, first_name: string, last_name: string, email: string, email_checked: boolean, id_checked: boolean, password: string, password_last_update: Date, created_at: Date, address: string, birthday: Date, national_registry: string, id_role: number, id_2fa?: number, id_id_check?: number, id_validation_code?: number, photo_path?: string } = req.validated;

        let hashedPassword: string = "";
        if(password && password.length > 0)
        {
            hashedPassword = await hash(password);
        }

        const member: IMember =
        {
            id: id,
            apple_id: apple_id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            email_checked: email_checked,
            id_checked: id_checked,
            password: hashedPassword,
            password_last_update: password_last_update,
            address: address,
            birthday: birthday,
            national_registry: national_registry,
            created_at: created_at,
            photo_path : photo_path || null,
            role : { id: id_role, name: "" },
            twoFA: id_2fa ?? null,
            id_check: id_id_check ?? null,
            validation_code: id_validation_code ?? null
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
    const { id }: { id: number } = req.validated;

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

export const searchMembersForTeam = async (req: Request, res: Response): Promise<void> =>
{
    const { search }: { search: string } = req.validated;

    try
    {
        const members: IMember[] = await memberModel.searchMembersForTeam(search, 5);
        res.send(members);
    }
    catch (error: any)
    {
        console.error("Error in searchMembersForTeam controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}