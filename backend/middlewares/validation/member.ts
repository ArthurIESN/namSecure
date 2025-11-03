import vine from '@vinejs/vine'
import {GET_MAX_LIMIT} from "../../utils/constants/constants.js";
import { nationalRegistryRegex } from "../../utils/nationalRegistry/nationalRegistry.js";

const memberSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const membersSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
});

const createMemberSchema = vine.object({
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
    first_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).nullable(),
    last_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).nullable(),
    email: vine.string().email().maxLength(100),
    email_checked: vine.boolean(),
    id_checked: vine.boolean(),
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

export const
    member = vine.compile(memberSchema),
    members = vine.compile(membersSchema),
    createMember = vine.compile(createMemberSchema),
    updateMember = vine.compile(updateSchema),
    passwordChange = vine.compile(passwordChangeSchema),
    passwordReset = vine.compile(passwordResetSchema);