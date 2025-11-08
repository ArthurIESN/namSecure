import { Request, Response } from 'express';
import {IAuthTwoFactor} from "@namSecure/shared/types/auth/auth";
import * as twoFactorModel from '../../models/auth/twoFactor.js';
import {setTokenCookie} from "../../utils/cookie/cookie.js";

export const setup = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id, email }: {id: number, email: string} = req.user!;
        const { member_2fa }: {member_2fa: { is_enabled: boolean} | null} = req.member!;

        if (member_2fa !== null)
        {
            res.status(400).json({ error: 'Two-factor authentication is already set up' });
            return;
        }

        const twoFactor: IAuthTwoFactor = await twoFactorModel.setup(id, email);

        res.status(200).json(twoFactor);
    }
    catch (error: any)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const setupVerify = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: {id: number} = req.user!;
        const { code }: {code: string} = req.body;
        const { member_2fa }: {member_2fa: { is_enabled: boolean} | null} = req.member!;

        if (member_2fa === null)
        {
            res.status(400).json({ error: 'Two-factor authentication is not enabled' });
            return;
        }

        const token: string = await twoFactorModel.setupVerify(id, code);
        setTokenCookie(res, token);

        res.status(200).json({ message: 'Two-factor authentication successful' });
    }
    catch (error: any)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const verify = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: {id: number} = req.user!;
        const { code }: {code: string} = req.body;

        const token: string = await twoFactorModel.verify(id, code);

        setTokenCookie(res, token);

        res.status(200).json({ message: 'Two-factor authentication verified' });
    }
    catch (error: any)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}