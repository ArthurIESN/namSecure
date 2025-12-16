import vine, {SimpleMessagesProvider} from '@vinejs/vine'
import {GET_MAX_LIMIT} from "../../../utils/constants/constants";
import {messages} from "@/middlewares/validation/messageProvider";

const typeDangersSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

const typeDangersUsedSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

const typeDangerSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const createTypeDangerSchema = vine.object({
    name: vine.string().minLength(3).maxLength(50),
    icon: vine.string().minLength(1).maxLength(255),
    is_used: vine.boolean(),
});

const updateTypeDangerSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    name: vine.string().minLength(3).maxLength(50),
    icon: vine.string().minLength(1).maxLength(255),
    is_used: vine.boolean(),
});

const fields ={
    "name": "name",
    "icon": "icon",
    "is_used": "is used",
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    typeDangers = vine.compile(typeDangersSchema),
    typeDangersUsed = vine.compile(typeDangersUsedSchema),
    typeDanger = vine.compile(typeDangerSchema),
    createTypeDanger = vine.compile(createTypeDangerSchema),
    updateTypeDanger = vine.compile(updateTypeDangerSchema);