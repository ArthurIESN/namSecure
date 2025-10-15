import vine from '@vinejs/vine';

const registerSchema = vine.object({
    email: vine.string().email().maxLength(100),
    password: vine.string().minLength(1).maxLength(255).confirmed(),
    address: vine.string().minLength(1).maxLength(255)
});

export const
    register = vine.compile(registerSchema);

