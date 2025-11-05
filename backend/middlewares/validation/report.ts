import vine from '@vinejs/vine'
import {GET_MAX_LIMIT} from "../../utils/constants/constants.js";

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
    photo_path: vine.string().minLength(1).maxLength(255).nullable().optional(),
    id_member: vine.number().positive().withoutDecimals(),
    id_type_danger: vine.number().positive().withoutDecimals(),
});

const updateReportSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    date: vine.date({ formats: { utc: true } }),
    lat: vine.number(),
    lng: vine.number(),
    street: vine.string().minLength(1).maxLength(255),
    level: vine.number().withoutDecimals(),
    photo_path: vine.string().minLength(1).maxLength(255).optional().nullable(),
    id_member: vine.number().positive().withoutDecimals(),
    id_type_danger: vine.number().positive().withoutDecimals(),
});

export const
    reports = vine.compile(reportsSchema),
    report = vine.compile(reportSchema),
    createReport = vine.compile(createReportSchema),
    updateReport = vine.compile(updateReportSchema);