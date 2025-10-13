import { Request, Response } from 'express';
import * as registerModel from '../../models/auth/register.js';
import { setToken } from "../../utils/cookie/cookie.js";

export const register = async (req: Request, res: Response) : Promise<void> =>
{
    const { email, password, address } = req.body;
    // data are validated in the validation middleware

    try
    {
        const token = await registerModel.register(email, password, address);
        setToken(res, token);
        res.status(201).json({ message: "Registration successful", token });
    }
    catch (error : any)
    {
        //@TODO : HANDLE ERRORS
        console.error(error);
        res.status(400).json({ error: error.message });
    }

}

export const requestEmailValidation = async (req: Request, res: Response) : Promise<void> =>
{
    // memberId and memberEmail are set in thr token
    const { id, email } = req.user;

    try
    {
        await registerModel.requestEmailValidation(id, email);
        res.status(200).json({ message: "Email validation requested" });
    }
    catch (error : any)
    {
        //@TODO : HANDLE ERRORS
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}
