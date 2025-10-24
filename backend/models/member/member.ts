import prisma from '../../database/databasePrisma.js';
import { IMember } from '@namSecure/shared/types/member/member';
import { InvalidIdError } from "../../errors/InvalidIdError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { hash } from "../../utils/hash/hash.js";
import { UniqueConstraintError } from "../../errors/database/UniqueConstraintError.js";
import { databaseErrorCodes } from "../../utils/prisma/prismaErrorCodes.js";
import { ForeignKeyConstraintError } from "../../errors/database/ForeignKeyConstraintError.js";

export const getMembers = async (): Promise<IMember[]> =>
{
        const dbMembers : any[] = await prisma.member.findMany(
        {
            include:
            {
                member_role: true,
                member_2fa: true,
                member_id_check: true
            }
        });

        const members : IMember[] =  dbMembers.map(m => ({
            id: m.id,
            first_name: m.first_name,
            last_name: m.last_name,
            email: m.email,
            email_checked: m.email_checked,
            id_checked: m.id_checked,
            password: "", // Do not expose password (even hashed)
            password_last_update: m.password_last_update,
            address: m.address,
            birthday: m.birthday,
            national_registry: m.national_registry,
            created_at: m.created_at,
            role:
            {
                id: m.member_role.id,
                name: m.member_role.name,
            },
            twoFA: m.member_2fa ? {
                id: m.member_2fa.id,
                secret_key: m.member_2fa.secret_key,
                is_enabled: m.member_2fa.is_enabled,
                created_at: m.member_2fa.created_at,
            } : null,
            id_check: m.member_id_check ? {
                id: m.member_id_check.id,
                card_front_id: m.member_id_check.card_front_id,
                card_back_id: m.member_id_check.card_back_id,
                reject_reason: m.member_id_check.reject_reason,
            } : null,
            id_validation_code: m.member_id_check.id_validation_code, // @TODO check if this is correct
        }));

        return members;
}

export const getMember = async (id: number): Promise<IMember> =>
{
    if(isNaN(id))
    {
        throw new InvalidIdError("Invalid member ID");
    }

    const dbMember : any | null = await prisma.member.findUnique(
    {
        where: { id: id },
        include:
        {
            member_role: true,
            member_2fa: true,
            member_id_check: true
        }
    });

    if(!dbMember)
    {
        throw new NotFoundError("Member not found");
    }

    const member : IMember =  {
        id: dbMember.id,
        first_name: dbMember.first_name,
        last_name: dbMember.last_name,
        email: dbMember.email,
        email_checked: dbMember.email_checked,
        id_checked: dbMember.id_checked,
        password: "", // Do not expose password (even hashed)
        password_last_update: dbMember.password_last_update,
        address: dbMember.address,
        birthday: dbMember.birthday,
        national_registry: dbMember.national_registry,
        created_at: dbMember.created_at,
        role:
        {
            id: dbMember.member_role.id,
            name: dbMember.member_role.name,
        },
        twoFA: dbMember.member_2fa ? {
            id: dbMember.member_2fa.id,
            secret_key: dbMember.member_2fa.secret_key,
            is_enabled: dbMember.member_2fa.is_enabled,
            created_at: dbMember.member_2fa.created_at,
        } : null,
        id_check: dbMember.member_id_check ? {
            id: dbMember.member_id_check.id,
            card_front_id: dbMember.member_id_check.card_front_id,
            card_back_id: dbMember.member_id_check.card_back_id,
            reject_reason: dbMember.member_id_check.reject_reason,
        } : null,
        id_validation_code: dbMember.member_id_check.id_validation_code, // @TODO check if this is correct
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