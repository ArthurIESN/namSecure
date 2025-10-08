import prisma from '../../database/databasePrisma.js';
import { IMemberRole } from '@namSecure/shared/types/member_role/member_role';
import { NotFoundError } from "../../errors/NotFoundError.js";
import { InvalidIdError } from "../../errors/InvalidIdError.js";
import { ForeignKeyConstraintError } from "../../errors/database/ForeignKeyConstraintError.js";
import { databaseErrorCodes } from "../../utils/prisma/prismaErrorCodes.js";

export const getMemberRoles = async (): Promise<IMemberRole[]> =>
{
    try
    {
        return await prisma.member_role.findMany();
    }
    catch (error)
    {
        console.error("Error fetching member roles:", error);
        throw error;
    }
}

export const getMemberRole = async (id: number): Promise<IMemberRole | null> =>
{
    try
    {
        if(isNaN(id))
        {
            throw new Error("Invalid role ID");
        }

        return await prisma.member_role.findUnique({
            where: {id: id}
        });
    }
    catch (error)
    {
        console.error("Error fetching member role:", error);
        throw error;
    }
}

export const createMemberRole = async (role: Omit<IMemberRole, "id">): Promise<IMemberRole> =>
{
    try
    {
        return await prisma.member_role.create({
            data:
                {
                    name: role.name
                }
        });
    }
    catch (error)
    {
        console.error("Error creating member role:", error);
        throw error;
    }
}

export const updateMemberRole = async (role : IMemberRole): Promise<void> =>
{
    try
    {
        // check if role exist
        const checkRole = await prisma.member_role.findUnique({ where: { id : role.id } });

        if (!checkRole)
        {
            throw new NotFoundError("Role not found");
        }

        await prisma.member_role.update({
            where: { id: role.id },
            data:
            {
                name : role.name
            }
        });
    }
    catch (error)
    {
        throw error;
    }
}

export const deleteMemberRole = async (id: number): Promise<void> =>
{
    if (isNaN(id))
    {
        throw new InvalidIdError("Invalid role id");
    }

    const role = await prisma.member_role.findUnique({ where: { id } });

    if (!role)
    {
        throw new NotFoundError("Role not found");
    }

    try
    {
        await prisma.member_role.delete({ where: { id } });
    }
    catch (error : any)
    {
        if(error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            throw new ForeignKeyConstraintError("Cannot delete a role used by a member");
        }
        throw error;
    }

}