import vine, {SimpleMessagesProvider} from '@vinejs/vine'
import { GET_MAX_LIMIT } from "@/utils/constants/constants";
import {messages} from "@/middlewares/validation/messageProvider";

const memberRolesSchema = vine.object(
{
        limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
        offset: vine.number().nonNegative().withoutDecimals(),
        search: vine.string().minLength(0).maxLength(100).optional(),
});

const memberRoleSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const createMemberRoleSchema = vine.object({
    name: vine.string().minLength(3).maxLength(50),
});

const updateMemberRoleSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    name: vine.string().minLength(3).maxLength(50),
});

const fields: Record<string, string> =
{
    name: "Role name"
};

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    memberRoles = vine.compile(memberRolesSchema),
    memberRole = vine.compile(memberRoleSchema),
    createMemberRole = vine.compile(createMemberRoleSchema),
    updateMemberRole = vine.compile(updateMemberRoleSchema);