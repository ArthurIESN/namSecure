import { Request, Response } from 'express';
import {IAuthTwoFactor} from "@namSecure/shared/types/auth/auth";
import * as twoFactorModel from '@/models/auth/twoFactor.js';
import {setTokenCookie} from "@/utils/cookie/cookie.js";
import {NotFoundError} from "@/errors/NotFoundError";
import {InvalidCodeError} from "@/errors/auth/InvalidCodeError";

export const setup = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id, email }: {id: number, email: string} = req.user!;
        const { codeQR }: {codeQR: boolean} = req.validated;
        const { member_2fa }: {member_2fa: { is_enabled: boolean} | null} = req.member!;

        if (member_2fa !== null)
        {
            res.status(400).json({ error: 'Two-factor authentication is already set up' });
            return;
        }

        const twoFactor: IAuthTwoFactor = await twoFactorModel.setup(id, email, codeQR);

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
        const { code }: {code: string} = req.validated;
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
        if(error instanceof InvalidCodeError)
        {
            res.status(400).json({ error: error.message });
            return;
        }

        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const verify = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: {id: number} = req.user!;
        const { code }: {code: string} = req.validated;

        const token: string = await twoFactorModel.verify(id, code);

        setTokenCookie(res, token);

        res.status(200).json({ message: 'Two-factor authentication verified' });
    }
    catch (error: any)
    {
        if(error instanceof InvalidCodeError)
        {
            res.status(400).json({ error: error.message });
            return;
        }

        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const disable = async (req: Request, res: Response): Promise<void> =>
{
    try
    {
        const { id }: {id: number} = req.user!;
        const { code }: {code: string} = req.validated;

        await twoFactorModel.disable(id, code);

        res.status(200).json({ message: 'Two-factor authentication disabled' });
    }
    catch (error: any)
    {
        if(error instanceof InvalidCodeError)
        {
            res.status(400).json({ error: error.message });
            return;
        }

        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}