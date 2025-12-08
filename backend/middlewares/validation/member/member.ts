import vine, {SimpleMessagesProvider} from '@vinejs/vine';
import {GET_MAX_LIMIT} from "@/utils/constants/constants";
import { nationalRegistryRegex } from "@/utils/nationalRegistry/nationalRegistry";
import { messages } from "@/middlewares/validation/messageProvider"

const memberSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const membersSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

const createMemberSchema = vine.object({
    apple_id: vine.string().minLength(2).maxLength(100).nullable(),
    first_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).nullable(),
    last_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).nullable(),
    email: vine.string().email().maxLength(100),
    email_checked: vine.boolean(),
    id_checked: vine.boolean(),
    password: vine.string().minLength(1).maxLength(255),
    password_last_update: vine.date({ formats: { utc: true } }), // trick to allow date with hours, minutes, seconds
    address: vine.string().minLength(1).maxLength(255),
    birthday: vine.date().nullable(),
    national_registry: vine.string().fixedLength(15).regex(nationalRegistryRegex).nullable(),
    created_at: vine.date(),
    id_role: vine.number().withoutDecimals(),
    id_2fa: vine.number().withoutDecimals().nullable(),
    id_id_check: vine.number().withoutDecimals().nullable(),
    id_validation_code: vine.number().withoutDecimals().nullable(),
});

const updateSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    apple_id: vine.string().minLength(2).maxLength(100).nullable(),
    first_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).nullable(),
    last_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).nullable(),
    email: vine.string().email().maxLength(100),
    email_checked: vine.boolean(),
    id_checked: vine.boolean(),
    password: vine.string().minLength(1).maxLength(255).optional(),
    password_last_update: vine.date({ formats: { utc: true } }), // trick to allow date with hours, minutes, seconds
    address: vine.string().minLength(1).maxLength(255),
    birthday: vine.date().optional().nullable(),
    national_registry: vine.string().fixedLength(15).regex(nationalRegistryRegex).nullable(),
    id_role: vine.number().withoutDecimals(),
    id_2fa: vine.number().withoutDecimals().nullable(),
    id_id_check: vine.number().withoutDecimals().nullable(),
    id_validation_code: vine.number().withoutDecimals().nullable(),
});

const passwordChangeSchema = vine.object({
    current_password: vine.string().minLength(1).maxLength(255),
    new_password: vine.string().minLength(1).maxLength(255).confirmed(),
});

const passwordResetSchema = vine.object({
    email: vine.string().email().maxLength(100),
});

const searchForTeamSchema = vine.object({
    search: vine.string().minLength(1).maxLength(100),
});

const fields =
{
    "apple_id": 'Apple ID',
    first_name: 'first name',
    last_name: 'last name',
    email: 'email',
    email_checked: 'email checked',
    id_checked: 'ID checked',
    password: 'password',
    password_confirmation: 'password confirmation',
    password_last_update: 'password last update',
    address: 'address',
    birthday: 'birthday',
    national_registry: 'national registry',
    created_at: 'created at',
    id_role: 'role ID',
    id_member_2fa: '2FA ID',
    id_member_id_check: 'ID check ID'
};

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    member = vine.compile(memberSchema),
    members = vine.compile(membersSchema),
    createMember = vine.compile(createMemberSchema),
    updateMember = vine.compile(updateSchema),
    passwordChange = vine.compile(passwordChangeSchema),
    passwordReset = vine.compile(passwordResetSchema),
    searchForTeam = vine.compile(searchForTeamSchema);