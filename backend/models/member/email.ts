import { NotFoundError } from "@/errors/NotFoundError";
import { PasswordError } from "@/errors/password/PasswordError";
import { verifyHash } from "@/utils/hash/hash";
import prisma from '@/database/databasePrisma';

export const changeEmail = async (userId: number, currentEmail: string, password: string, newEmail: string): Promise<void> =>
{

    const user = await prisma.member.findUnique({
        where: { id: userId },
        select: { password: true, email: true }
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const isPasswordValid: boolean = await verifyHash(user.password, password);
    if (!isPasswordValid) {
        throw new PasswordError("Password is incorrect");
    }

    if (user.email === newEmail) {
        throw new PasswordError("New email must be different from current email");
    }

    await prisma.member.update({
        where: { id: userId },
        data: {
            email: newEmail,
            email_checked: false
        }
    });
}