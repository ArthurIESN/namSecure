import vine from '@vinejs/vine'

const memberRoleSchema = vine.object({
    name: vine.string().minLength(3).maxLength(50),
});

const updateSchema = vine.object({
    name: vine.string().minLength(3).maxLength(50).optional(),
});

export const
    memberRole = vine.compile(memberRoleSchema),
    updateMemberRole = vine.compile(updateSchema);