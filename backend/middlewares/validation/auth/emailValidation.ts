import vine from '@vinejs/vine';

const emailValidationSchema = vine.object({
    code: vine.string()
        .minLength(6)
        .maxLength(6)
        .regex(/^[A-Z0-9]{6}$/), // We accept ony uppercase
                                                                       // letters and numbers (with a length of 6)
});

export const
        emailValidation = vine.compile(emailValidationSchema);