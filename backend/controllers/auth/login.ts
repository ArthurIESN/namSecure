import { Request, Response } from 'express';
import * as loginModel from '../../models/auth/login.js';
import { setToken} from "../../utils/cookie/cookie.js";

export const login = async (req: Request, res: Response) : Promise<void> =>
{
    const { email, password} = req.body;

    if(!email || !password)
    {
        res.status(400).json({ error: "Missing email, password" });
        return;
    }

    try
    {
        const token : string = await loginModel.login(email, password);
        setToken(res, token);
        res.status(200).json({ message: "Login successful", token});
    }
    catch (error : any)
    {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
}

