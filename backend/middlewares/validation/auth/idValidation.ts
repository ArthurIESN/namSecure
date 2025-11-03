import vine from '@vinejs/vine';

import { FILE_UPLOAD_SIZE_LIMIT } from "../../../utils/upload/upload.js";

const preIdValidationSchema = vine.object({
    front_id_card: vine.any(),
    back_id_card: vine.any()
});

const idValidationSchema = vine.object({
    front_id_card: vine.nativeFile().maxSize(FILE_UPLOAD_SIZE_LIMIT).mimeTypes(['image/jpeg', 'image/png']),
    back_id_card: vine.nativeFile().maxSize(FILE_UPLOAD_SIZE_LIMIT).mimeTypes(['image/jpeg', 'image/png'])
});

export const
    preIdValidation = vine.compile(preIdValidationSchema),
    idValidation = vine.compile(idValidationSchema);