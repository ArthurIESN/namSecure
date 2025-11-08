import { Request, Response } from 'express';
import * as registerModel from '../../models/auth/register.js';
import { setTokenCookie } from "../../utils/cookie/cookie.js";

export const register = async (req: Request, res: Response) : Promise<void> =>
{
    const { email, password, address }: { email: string, password: string, address: string } = req.body;

    try
    {
        const token: string = await registerModel.register(email, password, address);
        setTokenCookie(res, token);
        res.status(201).json({ message: "Registration successful", token });
    }
    catch (error : any)
    {
        //@TODO : HANDLE ERRORS
        console.error(error);
        res.status(400).json({ error: error.message });
    }

}
