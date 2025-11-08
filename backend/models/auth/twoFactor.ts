import prisma from '../../database/databasePrisma.js';
import speakeasy, {GeneratedSecret} from 'speakeasy';
import QRCode from 'qrcode';
import type {IAuthTwoFactor} from "@namSecure/shared/types/auth/auth";
import {signJWT} from "../../utils/jwt/jwt.js";
import {IAuthUser} from "../../types/user/user";

export const setup = async (id: number, email: string): Promise<IAuthTwoFactor> =>
{
    const secret: GeneratedSecret = speakeasy.generateSecret(
    {
        name: `NamSecure : ${email}`,
        issuer: 'NamSecure',
    });

    const qrCode: string = await QRCode.toDataURL(secret.otpauth_url!);

    await prisma.$transaction(async (tx) =>
    {
        const twoFA = await tx.member_2fa.create(
        {
            data:
            {
                secret_key: secret.base32,
                is_enabled: false
            }
        });

        await tx.member.update(
        {
            where: { id: id },
            data: { id_member_2fa: twoFA.id }
        });
    });

    return { secret: secret.base32, qrCode };
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
        throw new Error('User or 2FA not found');
    }

    const isValid: boolean = speakeasy.totp.verify(
    {
        secret: user.member_2fa.secret_key,
        encoding: 'base32',
        token: code,
        window: 2, // We accept code within 30s before or after
    });

    if (!isValid)
    {
        throw new Error('Invalid 2FA code'); // @todo custom error
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

    if (!user || !user.member_2fa || !user.member_2fa.is_enabled)
    {
        throw new Error('User or 2FA not found or not enabled');
    }

    const isValid: boolean = speakeasy.totp.verify(
    {
        secret: user.member_2fa.secret_key,
        encoding: 'base32',
        token: code,
        window: 2, // We accept code within 30s before or after
    });

    if (!isValid)
    {
        throw new Error('Invalid 2FA code'); // @todo custom error
    }

    const authUser: IAuthUser =
    {
        id: user.id,
        email: user.email,
        twoFactorVerified: true,
    }

    return await signJWT(authUser);
}