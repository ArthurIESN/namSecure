import vine, {SimpleMessagesProvider} from '@vinejs/vine'
import {GET_MAX_LIMIT} from "@/utils/constants/constants";
import {messages} from "@/middlewares/validation/messageProvider";

const reportsSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().nonNegative().withoutDecimals(),
    search: vine.string().minLength(0).maxLength(100).optional(),
});

const reportSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const createReportSchema = vine.object({
    date: vine.date({ formats: { utc: true } }),
    lat: vine.number(),
    lng: vine.number(),
    street: vine.string().minLength(1).maxLength(255),
    level: vine.number().withoutDecimals(),
    is_public: vine.boolean(),
    for_police: vine.boolean(),
    photo_path: vine.string().minLength(1).maxLength(255).nullable().optional(),
    id_member: vine.number().positive().withoutDecimals().optional(),
    id_type_danger: vine.number().positive().withoutDecimals(),
});

const updateReportSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    date: vine.date({ formats: { utc: true } }),
    lat: vine.number(),
    lng: vine.number(),
    street: vine.string().minLength(1).maxLength(255),
    level: vine.number().withoutDecimals(),
    is_public: vine.boolean(),
    for_police: vine.boolean(),
    photo_path: vine.string().minLength(1).maxLength(255).optional().nullable(),
    id_member: vine.number().positive().withoutDecimals(),
    id_type_danger: vine.number().positive().withoutDecimals(),
});

const fields ={
    "date": "date",
    "lat": "latitude",
    "lng": "longitude",
    "street": "street",
    "level": "level",
    "is_public": "is public",
    "for_police": "for police",
    "photo_path": "photo path",
    "id_type_danger": "type of danger",
    "id_member": "member",
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);


export const
    reports = vine.compile(reportsSchema),
    report = vine.compile(reportSchema),
    createReport = vine.compile(createReportSchema),
    updateReport = vine.compile(updateReportSchema);