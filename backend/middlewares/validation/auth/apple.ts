import vine from '@vinejs/vine';

const appleRegisterSchema = vine.object({
    identity_token: vine.string().minLength(1).maxLength(5000),
    address: vine.string().minLength(1).maxLength(255),
});

const appleLoginSchema = vine.object({
    identity_token: vine.string().minLength(1).maxLength(5000),
});

export const
    appleRegister = vine.compile(appleRegisterSchema),
    appleLogin = vine.compile(appleLoginSchema);