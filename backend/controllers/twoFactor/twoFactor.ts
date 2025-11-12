import { Request, Response } from 'express';
import * as twoFactorModel from '@/models/twoFactor/twoFactor';
import {IMember_2FA} from "@namSecure/shared/types/member_2fa/member_2fa";

export const getTwoFactors = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { limit, offset, search }: { limit: number, offset: number, search: string } = req.validated;

        const twoFactors: IMember_2FA[] = await twoFactorModel.getTwoFactors(limit, offset, search);
        res.status(200).json(twoFactors);
    }
    catch (error: any)
    {
        console.error("Error in getTwoFactors controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getTwoFactor = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: {id: number} = req.validated;

        const twoFactor: IMember_2FA | null = await twoFactorModel.getTwoFactor(id);
        if (twoFactor)
        {
            res.status(200).json(twoFactor);
        }
        else
        {
            res.status(404).json({ error: "Two-Factor Authentication entry not found" });
        }
    }
    catch (error: any)
    {
        console.error("Error in getTwoFactor controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createTwoFactor = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { secret_key, is_enabled, created_at }: { secret_key: string, is_enabled: boolean, created_at: Date} = req.validated;

        const twoFactor: IMember_2FA =
        {
            id: 0, // dummy value. not used
            secret_key: secret_key,
            is_enabled: is_enabled,
            created_at: created_at
        };

        await twoFactorModel.createTwoFactor(twoFactor);
        res.status(201).json({ message: "Two-Factor Authentication entry created successfully" });
    }
    catch (error: any)
    {
        console.error("Error in createTwoFactor controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateTwoFactor = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id, secret_key, is_enabled, created_at }: { id: number, secret_key: string, is_enabled: boolean, created_at: Date} = req.validated;

        const twoFactor: IMember_2FA =
        {
            id: id,
            secret_key: secret_key,
            is_enabled: is_enabled,
            created_at: created_at
        };

        await twoFactorModel.updateTwoFactor(twoFactor);
        res.status(200).json({ message: "Two-Factor Authentication entry updated successfully" });
    }
    catch (error: any)
    {
        console.error("Error in updateTwoFactor controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteTwoFactor = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: {id: number} = req.validated;

        await twoFactorModel.deleteTwoFactor(id);
        res.status(200).json({ message: "Two-Factor Authentication entry deleted successfully" });
    }
    catch (error: any)
    {
        console.error("Error in deleteTwoFactor controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}