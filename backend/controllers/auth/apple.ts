import {Request, Response} from "express";
import * as appleModel from '@/models/auth/apple.js';
import {setTokenCookie} from "@/utils/cookie/cookie";

export const register = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { address }: { address: string } = req.validated;
        const { apple } = req.apple;

        const appleId: string = apple.sub;
        const email: string = apple.email;

        const token: string = await appleModel.register(email, address, appleId);
        setTokenCookie(res, token);

        res.status(201).json({ message: 'Registration successful' });
    }
    catch (error: any)
    {
        res.status(500).json({ error: 'Internal server error' });
    }


}

export const login = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { apple } = req.apple;
        const appleId: string = apple.sub;

        const token: string = await appleModel.login(appleId);
        setTokenCookie(res, token);

        res.status(200).json({ message: 'Login successful' });
    }
    catch (error: any)
    {
        res.status(500).json({ error: 'Internal server error' });
    }

}