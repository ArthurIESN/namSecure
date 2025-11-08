import prisma from "../../database/databasePrisma.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {hash, verifyHash} from "../../utils/hash/hash.js";
import {PasswordError} from "../../errors/password/PasswordError.js";
import {renderEmail} from "../../utils/email/emailTemplate.js";
import {sendEmail} from "../../utils/email/email.js";

const PASSWORD_CHANGE_MIN_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const change = async (userId: number, email: string, currentPassword: string, newPassword: string) =>
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
    const now = new Date();
    const minChangeTime = new Date(now.getTime() - PASSWORD_CHANGE_MIN_HOURS);

    if(user.password_last_update > minChangeTime)
    {
        throw new PasswordError("Password was changed too recently");
    }

    // Verify old password
    const isOldPasswordValid = await verifyHash(user.password, currentPassword);

    if(!isOldPasswordValid)
    {
        throw new PasswordError("Old password is incorrect");
    }

    const hashedPassword = await hash(newPassword);

    await prisma.member.update(
    {
        where: { id: userId },
        data:
            {
                password: hashedPassword,
                password_last_update: now,
            }
    });

    const emailHtml = renderEmail('password/passwordUpdated', {});
    sendEmail(email, "Password Update",  undefined, emailHtml).catch(
        (error: any): void =>
        {
            console.error("Error sending verification email:", error);
        }
    )
}

export const reset = async (email: string) =>
{
    // @todo
    console.log("reset email", email);
}