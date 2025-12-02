import vine from '@vinejs/vine'
import { GET_MAX_LIMIT } from "@/utils/constants/constants";

const twoFactorsSchema = vine.object({
        limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
        offset: vine.number().nonNegative().withoutDecimals(),
        search: vine.string().minLength(0).maxLength(100).optional(),
});

const twoFactorSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});

const createTwoFactorSchema = vine.object({
    secret_key: vine.string().minLength(16).maxLength(500),
    is_enabled: vine.boolean(),
});

const updateTwoFactorSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    secret_key: vine.string().minLength(16).maxLength(500).optional(),
    is_enabled: vine.boolean(),
});

export const
    twoFactors = vine.compile(twoFactorsSchema),
    twoFactor = vine.compile(twoFactorSchema),
    createTwoFactor = vine.compile(createTwoFactorSchema),
    updateTwoFactor = vine.compile(updateTwoFactorSchema)