import prisma from "../../database/databasePrisma.js";
import {NotFoundError} from "../../errors/NotFoundError.js";
import {signJWT} from "../../utils/jwt/jwt.js";
import {hash} from "../../utils/hash/hash.js";
import {databaseErrorCodes} from "../../utils/prisma/prismaErrorCodes.js";
import {UniqueConstraintError} from "../../errors/database/UniqueConstraintError.js";
import {ForeignKeyConstraintError} from "../../errors/database/ForeignKeyConstraintError.js";

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
                    id_role: 1, // Default role ID for new members
                    email_checked: true, // Email is verified via Apple
                    id_checked: false,
                    created_at: date,
                    password_last_update: date,
                }
            });

        if(!member)
        {
            //@todo custom error handling
            throw new Error("Member creation failed");
        }

        const token: string = await signJWT({id: member.id, email: member.email, roleId: member.id_role, emailChecked: member.email_checked, idChecked: member.id_checked});

        return token;
    }
    catch(error: any)
    {
        if (error.code === databaseErrorCodes.UniqueConstraintViolation) {
            const target = error.meta?.target?.[0];
            let message = "";
            if (target === "email") {
                message = "Email already exists";
            }
            throw new UniqueConstraintError(message);
        } else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation) {
            const constraint = error.meta?.constraint;

            if (constraint === "member_id_role_fkey")
                throw new ForeignKeyConstraintError("Role does not reference a valid entry");

            console.error(constraint);
            throw new ForeignKeyConstraintError("a value does not reference a valid entry");
        } else {
            console.error("Error creating member:", error);
            throw error;
        }
    }
}

export const login = async (appleId: string): Promise<string> =>
{
    const member = await prisma.member.findUnique(
        {
            where: {
                apple_id: appleId
            }
        }
    );

    if(!member)
    {
        throw new NotFoundError("Member not found");
    }

    const token: string = await signJWT({id: member.id, email: member.email, roleId: member.id_role, emailChecked: member.email_checked, idChecked: member.id_checked});
    return token;
}