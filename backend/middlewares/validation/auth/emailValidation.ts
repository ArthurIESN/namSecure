import vine, {SimpleMessagesProvider} from '@vinejs/vine';
import {messages} from "@/middlewares/validation/messageProvider";

const emailValidationSchema = vine.object({
    code: vine.string()
        .minLength(6)
        .maxLength(6)
        .regex(/^[A-Z0-9]{6}$/), // We accept ony uppercase
                                                                       // letters and numbers (with a length of 6)
});

const fields: Record<string, string> =
{
    "code": "validation code",
};

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
        emailValidation = vine.compile(emailValidationSchema);