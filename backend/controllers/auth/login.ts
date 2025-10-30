import { Request, Response } from 'express';
import * as loginModel from '../../models/auth/login.js';
import { setTokenCookie } from "../../utils/cookie/cookie.js";

export const login = async (req: Request, res: Response) : Promise<void> =>
{
    const { email, password }: { email: string, password: string } = req.validated;

    try
    {
        const token: string = await loginModel.login(email, password);
        setTokenCookie(res, token);
        res.status(200).json({ message: "Login successful", token});
    }
    catch (error : any)
    {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
}

