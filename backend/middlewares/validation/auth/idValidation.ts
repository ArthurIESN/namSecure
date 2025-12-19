import vine, {SimpleMessagesProvider} from '@vinejs/vine';
import { FILE_UPLOAD_SIZE_LIMIT } from "@/utils/upload/upload";
import {messages} from "@/middlewares/validation/messageProvider";

const preIdValidationSchema = vine.object({
    front_id_card: vine.any(),
    back_id_card: vine.any()
});

const idValidationSchema = vine.object({
    front_id_card: vine.nativeFile().maxSize(FILE_UPLOAD_SIZE_LIMIT).mimeTypes(['image/jpeg', 'image/png']),
    back_id_card: vine.nativeFile().maxSize(FILE_UPLOAD_SIZE_LIMIT).mimeTypes(['image/jpeg', 'image/png'])
});

const fields: Record<string, string> =
    {
        "front_id_card": "front ID card",
        "back_id_card": "back ID card",
    };

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    preIdValidation = vine.compile(preIdValidationSchema),
    idValidation = vine.compile(idValidationSchema);