import vine, {SimpleMessagesProvider} from '@vinejs/vine';
import {messages} from "@/middlewares/validation/messageProvider";

const appleRegisterSchema = vine.object({
    identity_token: vine.string().minLength(1).maxLength(5000),
    address: vine.string().minLength(1).maxLength(255),
});

const appleLoginSchema = vine.object({
    identity_token: vine.string().minLength(1).maxLength(5000),
});

const fields =
    {
        "identity_token": "identity token",
    };

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    appleRegister = vine.compile(appleRegisterSchema),
    appleLogin = vine.compile(appleLoginSchema);