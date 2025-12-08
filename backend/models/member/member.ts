import prisma from '../../database/databasePrisma.js';
import { IMember } from '@namSecure/shared/types/member/member';
import { NotFoundError } from "../../errors/NotFoundError.js";
import { hash } from "../../utils/hash/hash.js";
import { UniqueConstraintError } from "../../errors/database/UniqueConstraintError.js";
import { databaseErrorCodes } from "../../utils/prisma/prismaErrorCodes.js";
import { ForeignKeyConstraintError } from "../../errors/database/ForeignKeyConstraintError.js";

export const getMembers = async (limit: number, offset: number, search: string): Promise<IMember[]> =>
{
        const dbMembers : any[] = await prisma.member.findMany(
        {
            take: limit,
            skip: offset * limit,
            where:
            {
                email:
                {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include:
            {
                member_role: true,
                member_2fa: true,
                member_id_check: true,
                validation_code: true
            },
            orderBy: search ? { email: 'asc' } : { id: 'asc' }
        });

        const members : IMember[] =  dbMembers.map(m => (
        {
            id: m.id,
            apple_id: m.apple_id,
            first_name: m.first_name,
            last_name: m.last_name,
            email: m.email,
            email_checked: m.email_checked,
            id_checked: m.id_checked,
            password_last_update: m.password_last_update,
            address: m.address,
            birthday: m.birthday,
            national_registry: m.national_registry,
            created_at: m.created_at,
            role: m.member_role,
            twoFA: m.member_2fa,
            id_check: m.member_id_check ,
            validation_code: m.id_validation_code
        }));

        return members;
}

export const getMember = async (id: number): Promise<IMember> =>
{
    const dbMember: any  = await prisma.member.findUnique(
    {
        where: { id: id },
        include:
        {
            member_role: true,
            member_2fa: true,
            member_id_check: true,
            validation_code: true
        }
    });

    if(!dbMember)
    {
        throw new NotFoundError("Member not found");
    }

    const member : IMember =  {
        id: dbMember.id,
        apple_id: dbMember.apple_id,
        first_name: dbMember.first_name,
        last_name: dbMember.last_name,
        email: dbMember.email,
        photo_path: dbMember.photo_path,
        email_checked: dbMember.email_checked,
        id_checked: dbMember.id_checked,
        password: "",
        password_last_update: dbMember.password_last_update,
        address: dbMember.address,
        birthday: dbMember.birthday,
        national_registry: dbMember.national_registry,
        created_at: dbMember.created_at,
        role: dbMember.member_role,
        twoFA: dbMember.member_2fa,
        id_check: dbMember.member_id_check,
        validation_code: dbMember.id_validation_code,
    };

    return member;
}

export const createMember = async (member: IMember) : Promise<void> =>
{
    try
    {
        const hashedPassword = await hash(member.password);

        const dbMember : any = await prisma.member.create(
        {
            data:
            {
                apple_id: member.apple_id,
                first_name: member.first_name,
                last_name: member.last_name,
                email: member.email,
                email_checked: member.email_checked,
                id_checked: member.id_checked,
                password: hashedPassword,
                password_last_update: member.password_last_update,
                address: member.address,
                birthday: member.birthday,
                national_registry: member.national_registry,
                created_at: member.created_at,
                id_role: member.role.id,
                id_member_2fa: member.twoFA ? member.twoFA.id : null,
                id_member_id_check: member.id_check ? member.id_check.id : null,
                id_validation_code: member.validation_code ? member.validation_code.id : null,
            }
        });

        if(!dbMember)
        {
            //@todo custom error handling
            throw new Error("Failed to create member");
        }
    }
    catch (error : any)
    {
        console.error(error);
        if(error.code === databaseErrorCodes.UniqueConstraintViolation)
        {
            const target = error.meta?.target?.[0];
            let message = "";
            if (target === "email")
            {
                message = "Email already exists";
            } else if (target === "national_registry")
            {
                message = "National registry number is already used";
            }

            throw new UniqueConstraintError(message);
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint = error.meta?.constraint;

            throw new ForeignKeyConstraintError(constraint + " does not reference a valid entry");
        }
        else
        {
            console.error("Error creating member:", error);
            throw error;
        }
    }
}

export const updateMember = async (member: IMember) : Promise<void> =>
{
    try
    {
        await prisma.member.update(
        {
            where: { id: member.id },
            data:
            {
                apple_id: member.apple_id,
                first_name: member.first_name,
                last_name: member.last_name,
                email: member.email,
                email_checked: member.email_checked,
                id_checked: member.id_checked,
                password_last_update: member.password_last_update,
                address: member.address,
                photo_path: member.photo_path,
                birthday: member.birthday,
                national_registry: member.national_registry,
                id_role: member.role.id,
                id_member_2fa: member.twoFA ? member.twoFA.id : null,
                id_member_id_check: member.id_check ? member.id_check.id : null,
                id_validation_code: member.validation_code ? member.validation_code.id : null,
            }
        });
    }
    catch (error : any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Member not found");
        }
        else if(error.code === databaseErrorCodes.UniqueConstraintViolation)
        {
            const target = error.meta?.target?.[0];
            let message = "";
            if (target === "email")
            {
                message = "Email already exists";
            } else if (target === "national_registry")
            {
                message = "National registry number is already used";
            }

            throw new UniqueConstraintError(message);
        }
        else if (error.code === databaseErrorCodes.ForeignKeyConstraintViolation)
        {
            const constraint = error.meta?.constraint;

            throw new ForeignKeyConstraintError(constraint + " does not reference a valid entry");
        }
        throw error;
    }
}

export const deleteMember = async (id: number): Promise<void> =>
{
    try
    {
        await prisma.member.delete({ where: { id } });
    }
    catch (error : any)
    {
        if(error.code === databaseErrorCodes.RecordNotFound)
        {
            throw new NotFoundError("Member not found");
        }
        throw error;
    }
}

export const searchMembersForTeam = async (search: string, limit: number = 5): Promise<IMember[]> =>
{
    try
    {
        const dbMembers: any[] = await prisma.member.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                first_name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                last_name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                address: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                ]
            },
            include: {
                member_role: true,
                member_2fa: true,
                member_id_check: true,
                validation_code: true,
                team_member: {
                    select: {
                        id: true
                    }
                }
            },
            take: limit * 3
        });

        const filteredMembers = dbMembers
            .filter(m => m.team_member.length < 2)
            .slice(0, limit);

        const members: IMember[] = filteredMembers.map(m => ({
            id: m.id,
            apple_id: m.apple_id,
            first_name: m.first_name,
            last_name: m.last_name,
            email: m.email,
            photo_path: m.photo_path,
            email_checked: m.email_checked,
            id_checked: m.id_checked,
            password: "",
            password_last_update: m.password_last_update,
            address: m.address,
            birthday: m.birthday,
            national_registry: m.national_registry,
            created_at: m.created_at,
            role: m.member_role,
            twoFA: m.member_2fa,
            id_check: m.member_id_check,
            validation_code: m.id_validation_code
        }));

        return members;
    }
    catch (error: any)
    {
        console.error("Error searching members for team:", error);
        throw error;
    }
}