import vine, {SimpleMessagesProvider} from '@vinejs/vine';
import {messages} from "@/middlewares/validation/messageProvider";

const setupTwoFactorSchema = vine.object({
    codeQR: vine.boolean()
});

const verifyTwoFactorSchema = vine.object({
    code: vine.string().minLength(6).maxLength(6)
});

const fields: Record<string, string> =
    {
        "code": "two-factor authentication code",
        "codeQR": "code QR"
    };

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    setup = vine.compile(setupTwoFactorSchema),
    verify = vine.compile(verifyTwoFactorSchema);

