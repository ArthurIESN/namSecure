import vine from '@vinejs/vine'

const memberSchema = vine.object({
    first_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).optional(),
    last_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).optional(),
    email: vine.string().email().maxLength(100),
    email_checked: vine.boolean(),
    id_checked: vine.boolean(),
    password: vine.string().minLength(1).maxLength(255).confirmed(),
    password_last_updated: vine.date(),
    address: vine.string().minLength(1).maxLength(255),
    birthday: vine.date().optional(),
    national_registry: vine.string().fixedLength(20).optional(),
    created_at: vine.date(),
    id_role: vine.number().withoutDecimals(),
    id_member_2fa: vine.number().withoutDecimals().optional(),
    id_member_id_check: vine.number().withoutDecimals().optional(),
});

const updateSchema = vine.object({
    first_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).optional(),
    last_name: vine.string().minLength(2).maxLength(50).regex(/^[a-zA-Z]+$/).optional(),
    email: vine.string().email().maxLength(100).optional(),
    email_checked: vine.boolean().optional(),
    id_checked: vine.boolean().optional(),
    password: vine.string().minLength(1).maxLength(255).confirmed().optional(),
    password_last_updated: vine.date().optional(),
    address: vine.string().minLength(1).maxLength(255).optional(),
    birthday: vine.date().optional(),
    national_registry: vine.string().fixedLength(20).optional(),
    id_role: vine.number().withoutDecimals().optional(),
    id_member_2fa: vine.number().withoutDecimals().optional(),
    id_member_id_check: vine.number().withoutDecimals().optional(),
});

export const
    member = vine.compile(memberSchema),
    updateMember = vine.compile(updateSchema);