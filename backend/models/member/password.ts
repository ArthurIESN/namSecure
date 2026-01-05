import prisma from "@/database/databasePrisma.js";
import {NotFoundError} from "@/errors/NotFoundError";
import {hash, verifyHash} from "@/utils/hash/hash";
import {PasswordError} from "@/errors/password/PasswordError";
import {renderEmail} from "@/utils/email/emailTemplate";
import {sendEmail} from "@/utils/email/email";
import {signResetPasswordJWT} from "@/utils/jwt/jwt";

const PASSWORD_CHANGE_MIN_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const change = async (userId: number, email: string, currentPassword: string, newPassword: string): Promise<void> =>
{
    const user = await prisma.member.findUnique(
        {
            where: { id: userId } ,
            select:
                {
                    password: true,
                    password_last_update: true,
                }
        });

    if (!user)
    {
        throw new NotFoundError("User not found");
    }

    // Check if password was changed recently
    const now: Date = new Date();
    const minChangeTime: Date = new Date(now.getTime() - PASSWORD_CHANGE_MIN_HOURS);

    if(user.password_last_update > minChangeTime)
    {
        throw new PasswordError("Password was changed too recently");
    }

    // Verify old password
    const isOldPasswordValid: boolean = await verifyHash(user.password, currentPassword);

    if(!isOldPasswordValid)
    {
        throw new PasswordError("Old password is incorrect");
    }

    const hashedPassword: string = await hash(newPassword);

    await prisma.member.update(
    {
        where: { id: userId },
        data:
            {
                password: hashedPassword,
                password_last_update: now,
            }
    });

    const emailHtml: string = renderEmail('password/passwordUpdated', {});
    sendEmail(email, "Password Update",  undefined, emailHtml).catch(
        (error: any): void =>
        {
            console.error("Error sending verification email:", error);
        }
    )
}

export const reset = async (email: string): Promise<void> =>
{
    const user = await prisma.member.findUnique(
    {
        where: { email: email } ,
    });

    if (!user)
    {
        return;
    }


    const resetToken: string = await signResetPasswordJWT(email, user.id);

    const emailHtml: string = renderEmail('password/passwordReset', { webResetLink: `${process.env.BACKOFFICE_URL}/ResetPassword?token=${resetToken}` });
    sendEmail(email,"Password Reset",  undefined, emailHtml).catch(
        (error: any): void =>
        {
            console.error("Error sending verification email:", error);
        }
    )
}

export const resetConfirm = async (email: string, newPassword: string, userId: number): Promise<void> =>
{
    const user = await prisma.member.findUnique(
        {
            where: { id: userId } ,
        });

    if (!user)
    {
        throw new NotFoundError("User not found");
    }

    // Check if password was changed recently
    const now: Date = new Date();
    const minChangeTime: Date = new Date(now.getTime() - PASSWORD_CHANGE_MIN_HOURS);

    if(user.password_last_update > minChangeTime)
    {
        throw new PasswordError("Password was changed too recently");
    }

    const hashedPassword: string = await hash(newPassword);

    await prisma.member.update(
    {
        where: { id: userId },
        data:
            {
                password: hashedPassword,
                password_last_update: new Date(),
            }
    });
}

export const verify = async (userId: number, password: string): Promise<boolean> =>
{
    const user = await prisma.member.findUnique(
        {
            where: { id: userId } ,
            select:
                {
                    password: true,
                }
        });

    if (!user)
    {
        throw new NotFoundError("User not found");
    }

    return await verifyHash(user.password, password);
}