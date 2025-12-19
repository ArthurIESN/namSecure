import prisma from "@/database/databasePrisma";
import {NotFoundError} from "@/errors/NotFoundError";
import {signJWT} from "@utils/jwt/jwt";
import {hash} from "@utils/hash/hash";
import {databaseErrorCodes} from "@utils/prisma/prismaErrorCodes";
import {UniqueConstraintError} from "@/errors/database/UniqueConstraintError";
import {ForeignKeyConstraintError} from "@/errors/database/ForeignKeyConstraintError";
import {IAuthUser} from "@/types/user/user";

export const register = async (email: string, address: string, appleId: string) : Promise<string> =>
{
    try
    {
        const password: string = await hash(appleId);
        const date: Date = new Date();

        const member = await prisma.member.create(
            {
                data:
                {
                    email: email,
                    password: password,
                    address: address,
                    id_role: 2, // Default role ID for new members
                    email_checked: true, // Email is verified via Apple
                    id_checked: false,
                    created_at: date,
                    password_last_update: date,
                }
            });

        if(!member)
        {
            throw new Error("Member creation failed");
        }

        const authUser: IAuthUser =
            {
                id: member.id,
                email: member.email,
                twoFactorVerified: false
            }

        return await signJWT(authUser);
    }
    catch(error: any)
    {
        if (error.code === databaseErrorCodes.UniqueConstraintViolation)
        {
            const target: string = error.meta?.target?.[0] as string;
            let message: string = "";
            if (target === "email")
            {
                message = "Email already exists";
            }

            throw new UniqueConstraintError(message);
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint: string = error.meta?.constraint as string;

            if (constraint === "member_id_role_fkey")
                throw new ForeignKeyConstraintError("Role does not reference a valid entry");

            throw new ForeignKeyConstraintError("a value does not reference a valid entry");
        }
        else
        {
            console.error("Error creating member:", error);
            throw error;
        }
    }
}

export const login = async (appleId: string): Promise<string> =>
{
    const member = await prisma.member.findUnique(
        {
            where:
            {
                apple_id: appleId
            }
        }
    );

    if(!member)
    {
        throw new NotFoundError("Member not found");
    }

    const authUser: IAuthUser =
    {
        id: member.id,
        email: member.email,
        twoFactorVerified: false
    }

    return await signJWT(authUser);
}