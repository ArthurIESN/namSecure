import prisma from '../../database/databasePrisma.js';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import type {IAuthTwoFactor} from "@namSecure/shared/types/auth/auth";
import {signJWT} from "../../utils/jwt/jwt.js";
import {IAuthUser} from "../../types/user/user";

export const setup = async (id: number, email: string): Promise<IAuthTwoFactor> =>
{
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, 'NamSecure', secret);

    //@ todo add a params to the request to deactivate qr code generation if not needed
    const qrCode: string = await QRCode.toDataURL(otpauthUrl);

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
        throw new Error('User or 2FA not found');
    }

    const isValid: boolean = authenticator.check(code, user.member_2fa.secret_key, { window: 2 });

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

    const isValid: boolean = authenticator.check(code, user.member_2fa.secret_key, { window: 2 });

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