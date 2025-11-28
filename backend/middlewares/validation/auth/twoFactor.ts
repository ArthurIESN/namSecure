import vine from '@vinejs/vine';

const setupTwoFactorSchema = vine.object({
    //getCodeQR: vine.boolean()
});

const verifyTwoFactorSchema = vine.object({
    code: vine.string().minLength(6).maxLength(6)
});

export const
    setup = vine.compile(setupTwoFactorSchema),
    verify = vine.compile(verifyTwoFactorSchema);

