import { Request, Response } from 'express';
import * as registerModel from '@/models/auth/register';
import { setTokenCookie } from "@/utils/cookie/cookie";
import {UniqueConstraintError} from "@/errors/database/UniqueConstraintError";
import {RegisterError} from "@/errors/auth/RegisterError";

export const register = async (req: Request, res: Response) : Promise<void> =>
{
    const { email, password, address }: { email: string, password: string, address: string } = req.body;

    try
    {
        const token: string = await registerModel.register(email, password, address);
        setTokenCookie(res, token);
        res.status(201).json({ message: "Registration successful", token });
    }
    catch (error: any)
    {
        if(error instanceof UniqueConstraintError || error instanceof UniqueConstraintError )
        {
            res.status(400).json({ error: error.message });
            return;
        }
        else if (error instanceof RegisterError)
        {
            console.error(error.message);
            res.status(400).json({ error: "Failed to register the member" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: error.message });
    }

}
