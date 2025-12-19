import prisma from '../../database/databasePrisma.js';
import { signJWT } from "@/utils/jwt/jwt";
import { databaseErrorCodes } from "@/utils/prisma/prismaErrorCodes";
import { UniqueConstraintError } from "@/errors/database/UniqueConstraintError";
import { ForeignKeyConstraintError } from "@/errors/database/ForeignKeyConstraintError";
import { hash } from "@/utils/hash/hash";
import {IVerificationCode, generateVerificationCode } from "@/utils/code/code";
import { renderEmail } from "@/utils/email/emailTemplate";
import { sendEmail } from "@/utils/email/email";
import {IAuthUser} from '@/types/user/user';
import {RegisterError} from "@/errors/auth/RegisterError";
const VALIDATION_CODE_EXPIRY_HOURS = 24; //@TODO move this away (e.g. config file or env variable)

export const register = async (email: string, password: string, address: string) : Promise<string> =>
{
    try
    {
        const hashedPassword: string = await hash(password);
        const date: Date = new Date();

        const member = await prisma.member.create({
            data: {
                email: email,
                password: hashedPassword,
                address: address,
                id_role: 2,
                email_checked: false,
                id_checked: false,
                created_at: date,
                password_last_update: date,
            }
        });

        if(!member)
        {
            throw new RegisterError("Member creation failed");
        }

        const authUser: IAuthUser =
        {
            id: member.id,
            email: member.email,
            twoFactorVerified: false,
        }
        return await signJWT(authUser);
    }
    catch(error: any)
    {
        if(error.code === databaseErrorCodes.UniqueConstraintViolation)
        {
            const target: any = error.meta?.target?.[0];
            let message: string = "";
            if (target === "email")
            {
                message = "Email already exists";
            }
            throw new UniqueConstraintError(message);
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint = error.meta?.constraint;

            if(constraint === "member_id_role_fkey")
                throw new ForeignKeyConstraintError("Role does not reference a valid entry");

            console.error(constraint);
            throw new ForeignKeyConstraintError("a value does not reference a valid entry");
        }
        else
        {
            console.error("Error creating member:", error);
            throw error;
        }
    }
}

export const requestEmailValidation = async (memberId: number, memberEmail: string): Promise<void> =>
{
    const code: IVerificationCode = await generateVerificationCode();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + VALIDATION_CODE_EXPIRY_HOURS);
    console.debug(memberId);

    const emailHtml = renderEmail('validationCode/validationCode', {code: code.code, expiryHours: VALIDATION_CODE_EXPIRY_HOURS, date: new Date().getDate() });

    await sendEmail(memberEmail, 'Your verification code', undefined, emailHtml);
}

/*
export const registerEmail = async (memberId: number, validateCode: string): Promise<string> =>
{

}*/