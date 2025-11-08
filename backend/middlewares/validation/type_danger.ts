import vine from '@vinejs/vine'
import {GET_MAX_LIMIT} from "../../utils/constants/constants.js";

const typeDangersSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

const typeDangerSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const createTypeDangerSchema = vine.object({
    name: vine.string().minLength(3).maxLength(50),
});

const updateTypeDangerSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    name: vine.string().minLength(3).maxLength(50),
});

export const
    typeDangers = vine.compile(typeDangersSchema),
    typeDanger = vine.compile(typeDangerSchema),
    createTypeDanger = vine.compile(createTypeDangerSchema),
    updateTypeDanger = vine.compile(updateTypeDangerSchema);