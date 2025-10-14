import vine from '@vinejs/vine';

const loginSchema = vine.object({
    email: vine.string().email().maxLength(100),
    password: vine.string().minLength(1).maxLength(255).confirmed(),
});

export const
    login = vine.compile(loginSchema);