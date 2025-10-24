import prisma from '../../database/databasePrisma.js';
import {generateVerificationCode, IVerificationCode} from "../../utils/code/code.js";
import {sendEmail} from "../../utils/email/email.js";
import {renderEmail} from "../../utils/email/emailTemplate.js";
import {TooManyAttempsError} from "../../errors/auth/TooManyAttempsError.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {verifyHash} from "../../utils/hash/hash.js";
import {CodeExpiredError} from "../../errors/auth/CodeExpiredError.js";
import {InvalidCodeError} from "../../errors/auth/InvalidCodeError.js";

const VALIDATION_CODE_EXPIRY_HOURS = 24; //@TODO move this away (e.g. config file or env variable)



export const emailValidation = async (id: number, email: string): Promise<void> =>
{
    const user = await prisma.member.findUnique({
        where: { id: id },
        include: { validation_code: true }
    });

    if(!user)
    {
        throw new NotFoundError("No member found");
    }

    if(user.validation_code)
    {
        if(user.validation_code.expires_at > new Date() && user.validation_code.attempts >= 3)
        {
            throw new TooManyAttempsError("Too many attempts. New Validation code will be allowed after " + user.validation_code.expires_at.toString());
        }
        else if(user.validation_code.expires_at > new Date())
        {
           return ; // still valid, no need to generate a new one
        }
    }

    // if there is no validation code or it is expired, generate a new one
    const code: IVerificationCode = await generateVerificationCode();
    await prisma.$transaction(async (transaction) =>
    {
        if(user.validation_code)
        {
            // update the validation code
            await prisma.validation_code.update({
                where: { id: user.validation_code!.id },
                data: {
                    code_hash: code.hash,
                    expires_at: code.expires,
                    attempts: 0
                }
            });
        }
        else
        {
            const validationCode = await transaction.validation_code.create({
                data: {
                    code_hash: code.hash,
                    expires_at: code.expires,
                    attempts: 0
                }
            });

            await transaction.member.update({
                where: { id: id },
                data: {
                    id_validation_code: validationCode.id
                }
            });
        }
    });


        // send the email
        const emailHtml = renderEmail('validationCode/validationCode', {code: code.code, expiryHours: VALIDATION_CODE_EXPIRY_HOURS, date: new Date().getDate().toString() });
        sendEmail(email, "Your verification code",  undefined, emailHtml).catch(
            (error: any): void =>
            {
                console.error("Error sending verification email:", error);
            }
        )
}

export const emailVerify = async (id: number, code: string): Promise<void> =>
{
    const user = await prisma.member.findUnique({where: { id: id }, include: { validation_code: true }});

    if(!user)
    {
        throw new NotFoundError("User not found");
    }

    if(!user.validation_code)
    {
        throw new NotFoundError("No validation code found for user");
    }

    if(user.validation_code.expires_at < new Date())
    {
        throw new CodeExpiredError("Validation code expired");
    }

    if(user.validation_code.attempts >= 3)
    {
        throw new TooManyAttempsError("Too many attempts. New Validation code will be allowed after " + user.validation_code.expires_at.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }

    if(await verifyHash(user.validation_code.code_hash, code))
    {
        // mark email as verified
        await prisma.$transaction(async (transaction) =>
        {
            await transaction.member.update({
                where: { id: id },
                data: {
                    email_checked: true,
                    id_validation_code: null
                }
            });

            await transaction.validation_code.delete({
                where: { id: user.validation_code!.id }
            });
        });
    }
    else
    {
        await prisma.validation_code.update({
            where: { id: user.validation_code.id },
            data: {
                attempts: { increment: 1 }
            }
        });

        throw new InvalidCodeError("Invalid validation code");
    }
}