import prisma from '../../database/databasePrisma.js';
import { IMemberRole } from '@namSecure/shared/types/member_role/member_role';
import { NotFoundError } from "../../errors/NotFoundError.js";
import { ForeignKeyConstraintError } from "../../errors/database/ForeignKeyConstraintError.js";
import { databaseErrorCodes } from "../../utils/prisma/prismaErrorCodes.js";

export const getMemberRoles = async (limit: number, offset: number, search: string): Promise<IMemberRole[]> =>
{
    return prisma.member_role.findMany(
        {
            take: limit,
            skip: offset * limit,
            where:
            {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            orderBy: search ? { name: 'asc' } : { id: 'asc' }
        });
}

export const getMemberRole = async (id: number): Promise<IMemberRole | null> =>
{
    return prisma.member_role.findUnique(
    {
        where: {id: id}
    });
}

export const createMemberRole = async (role: Omit<IMemberRole, "id">): Promise<IMemberRole> =>
{
    return prisma.member_role.create({
        data:
            {
                name: role.name
            }
    });
}

export const updateMemberRole = async (role : IMemberRole): Promise<void> =>
{
    try
    {
        await prisma.member_role.update(
        {
            where: { id: role.id },
            data:
            {
                name : role.name
            }
        });
    }
    catch (error: any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Role not found");
        }
        throw error;
    }
}

export const deleteMemberRole = async (id: number): Promise<void> =>
{
    try
    {
        await prisma.member_role.delete({ where: { id } });
    }
    catch (error : any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Role not found");
        }
        else if(error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            throw new ForeignKeyConstraintError("Cannot delete a role used by a member");
        }
        throw error;
    }
}