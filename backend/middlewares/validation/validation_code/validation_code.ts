import vine, {SimpleMessagesProvider} from '@vinejs/vine';
import {GET_MAX_LIMIT} from "@/utils/constants/constants";
import {messages} from "@/middlewares/validation/messageProvider";

const validationCodesSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

const validationCodeSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const createValidationCodeSchema = vine.object({
    code_hash: vine.string().minLength(6).maxLength(6),
    expires_at: vine.date(),
    attempts: vine.number().nonNegative().withoutDecimals(),
});

const updateValidationCodeSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    code_hash: vine.string().minLength(6).maxLength(6).optional(),
    expires_at: vine.date(),
    attempts: vine.number().nonNegative().withoutDecimals(),
});

const fields =
    {
        "code_hash": "code hash",
        "expires_at": "expires at",
    };

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    validationCodes = vine.compile(validationCodesSchema),
    validationCode = vine.compile(validationCodeSchema),
    createValidationCode = vine.compile(createValidationCodeSchema),
    updateValidationCode = vine.compile(updateValidationCodeSchema);