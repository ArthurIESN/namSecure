import prisma from '../../database/databasePrisma.js';
import { signJWT } from "../../utils/jwt/jwt.js";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {UniqueConstraintError} from "../../errors/database/UniqueConstraintError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";
import { hashPassword} from "../../utils/hash/hash.js";
import {IVerificationCode, generateVerificationCode} from "../../utils/code/code.js";
import { renderEmail } from "../../utils/email/emailTemplate.js";
import {sendEmail} from "../../utils/email/email.js";

const VALIDATION_CODE_EXPIRY_HOURS = 24; //@TODO move this away (e.g. config file or env variable)

export const register = async (email: string, password: string, address: string) : Promise<string> =>
{
    try
    {
        const hashedPassword = await hashPassword(password);

        const member = await prisma.member.create({
            data: {
                email: email,
                password: hashedPassword,
                address: address,
                id_role: 1, // Default role ID for new members
                email_checked: false,
                id_checked: false,
                created_at: new Date(),
                password_last_update: new Date()
            }
        });

        if(!member)
        {
            //@todo custom error handling
            throw new Error("Member creation failed");
        }

        const token: string = signJWT({id: member.id, email: member.email, roleId: member.id_role, emailChecked: member.email_checked, idChecked: member.id_checked});

        return token;
    }
    catch(error: any)
    {
        if(error.code === databaseErrorCodes.UniqueConstraintViolation)
        {
            const target = error.meta?.target?.[0];
            let message = "";
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

    await prisma.validation_code.create(
        {
            data:
                {
                    id_member: memberId,
                    code_hash: code.hash,
                    expires_at: expiryDate
                }
        });

    const emailHtml = renderEmail('validationCode/validationCode', {code: code.code, expiryHours: VALIDATION_CODE_EXPIRY_HOURS, date: new Date().getDate() });

    await sendEmail(memberEmail, 'Your verification code', undefined, emailHtml);
}

/*
export const registerEmail = async (memberId: number, validateCode: string): Promise<string> =>
{

}*/