import prisma from "@/database/databasePrisma";
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import type {IAuthTwoFactor} from "@namSecure/shared/types/auth/auth";
import {signJWT} from "@/utils/jwt/jwt";
import {IAuthUser} from"@/types/user/user";
import {NotFoundError} from "@/errors/NotFoundError";
import {InvalidCodeError} from "@/errors/auth/InvalidCodeError";

export const setup = async (id: number, email: string, getCodeQR: boolean): Promise<IAuthTwoFactor> =>
{
    const secret: string = authenticator.generateSecret();
    const otpauthUrl: string = authenticator.keyuri(email, 'NamSecure', secret);

    const qrCode: string = getCodeQR ? await QRCode.toDataURL(otpauthUrl) : '';

    await prisma.$transaction(async (tx) =>
    {
        const twoFA = await tx.member_2fa.create(
        {
            data:
            {
                secret_key: secret,
                is_enabled: false
            }
        });

        await tx.member.update(
        {
            where: { id: id },
            data: { id_member_2fa: twoFA.id }
        });
    });

    return { secret: secret, qrCode };
}

export const setupVerify = async (id:number, code: string): Promise<string> =>
{
    const user = await prisma.member.findUnique(
    {
        where: { id: id },
        include:
        {
            member_2fa: true
        }
    });

    if (!user || !user.member_2fa)
    {
        throw new NotFoundError("Invalid user or 2FA");
    }

    const isValid: boolean = authenticator.check(code, user.member_2fa.secret_key);

    if (!isValid)
    {
        throw new InvalidCodeError('Invalid 2FA code');
    }

    await prisma.member_2fa.update(
    {
        where: { id: user.member_2fa.id },
        data: { is_enabled: true }
    });

    const authUser: IAuthUser =
        {
            id: user.id,
            email: user.email,
            twoFactorVerified: true,
        }

    return await signJWT(authUser);
}

export const verify = async (id:number, code: string): Promise<string> =>
{
    const user = await prisma.member.findUnique(
    {
        where: { id: id },
        include:
        {
            member_2fa: true
        }
    });

    console.log("Verifying 2FA for user:", user);

    if (!user || !user.member_2fa || !user.member_2fa.is_enabled)
    {
        throw new NotFoundError("Invalid user or 2FA not enabled");
    }

    const isValid: boolean = authenticator.check(code, user.member_2fa.secret_key);

    if (!isValid)
    {
        throw new InvalidCodeError('Invalid 2FA code');
    }

    const authUser: IAuthUser =
    {
        id: user.id,
        email: user.email,
        twoFactorVerified: true,
    }

    return await signJWT(authUser);
}