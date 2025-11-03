import vine from '@vinejs/vine'
import {GET_MAX_LIMIT} from "../../utils/constants/constants.js";

const typeDangersSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

export const
    typeDangers = vine.compile(typeDangersSchema);