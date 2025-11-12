import { Request, Response } from 'express';
import * as loginModel from '@/models/auth/login';
import { setTokenCookie } from "@/utils/cookie/cookie";
import {NotFoundError} from "@/errors/NotFoundError";

export const login = async (req: Request, res: Response) : Promise<void> =>
{
    const { email, password }: { email: string, password: string } = req.validated;

    try
    {
        const token: string = await loginModel.login(email, password);
        setTokenCookie(res, token);
        res.status(200).json({ message: "Login successful", token});
    }
    catch (error: any)
    {

        if(error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

