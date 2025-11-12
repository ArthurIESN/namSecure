import { Request, Response } from 'express';
import * as emailValidationModel from '../../models/auth/emailValidation.js';
import { TooManyAttempsError } from '../../errors/auth/TooManyAttempsError.js';
import { NotFoundError } from "../../errors/NotFoundError.js";
import { IAuthUser } from '../../types/user/user.js';
import {CodeExpiredError} from "../../errors/auth/CodeExpiredError.js";
import {InvalidCodeError} from "../../errors/auth/InvalidCodeError.js";

export const emailValidation = async (req: Request, res: Response) : Promise<void> =>
{
    const user: IAuthUser = req.user as IAuthUser;

    try
    {
        await emailValidationModel.emailValidation(user.id, user.email);

        res.status(200).json({ message: 'Validation email sent successfully', email: user.email });
    }
    catch (error: any)
    {
        if(error instanceof TooManyAttempsError)
        {
            res.status(429).json({ error: error.message, email: user.email });
        }
        else if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message, email: user.email });
        }
        else
        {
            console.error('Error while doing an email validation:', error);
            res.status(500).json({ error: 'Internal server error', email: user.email });
        }
    }
}

export const emailVerify = async (req: Request, res: Response) : Promise<void> =>
{
    const user: IAuthUser = req.user as IAuthUser;
    const { code }: { code: string } = req.body;

    try
    {
        await emailValidationModel.emailVerify(user.id, code);
        res.status(200).json({ message: 'Email successfully verified' });
    }
    catch (error: any)
    {
        if (error instanceof CodeExpiredError || error instanceof InvalidCodeError)
        {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof NotFoundError)
        {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof TooManyAttempsError)
        {
            res.status(429).json({ error: error.message });
        }
        else
        {
            console.error('Error while verifying email code:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}