import vine from "@vinejs/vine";
import {GET_MAX_LIMIT} from "../../../utils/constants/constants.js";

const teamsSchema = vine.object({
    limit : vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
});

const teamSchema = vine.object({
    id : vine.number().positive().withoutDecimals(),
});

const createTeamAdminSchema = vine.object({
    name : vine.string().minLength(3).maxLength(100),
    id_member : vine.number(),
    team_member: vine.array(
        vine.object({
            id_member: vine.number().positive().withoutDecimals(),
            accepted: vine.boolean()
        })
    ).optional()
});

const createTeamUserSchema = vine.object({
    name: vine.string().minLength(3).maxLength(100),
    team_member: vine.array(
        vine.object({
            id_member: vine.number().positive().withoutDecimals(),
            accepted: vine.boolean()
        })
    ).optional()
});

const updateTeamAdminSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    name: vine.string().minLength(3).maxLength(100),
    id_member: vine.number().positive().withoutDecimals(),
    id_report: vine.number().positive().withoutDecimals().nullable(),
    team_member: vine.array(
        vine.object({
            id_member: vine.number().positive().withoutDecimals(),
            accepted: vine.boolean()
        })
    ).optional()
});

const updateTeamTeamAdminSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    name: vine.string().minLength(3).maxLength(100),
    id_member: vine.number().positive().withoutDecimals(),
    id_report: vine.number().positive().withoutDecimals().nullable(),
    team_member: vine.array(
        vine.object({
            id_member: vine.number().positive().withoutDecimals(),
            accepted: vine.boolean()
        })
    ).optional()
});


export const
    teams = vine.compile(teamsSchema),
    team = vine.compile(teamSchema),
    createTeamAdmin = vine.compile(createTeamAdminSchema),
    createTeamUser = vine.compile(createTeamUserSchema),
    updateTeamAdmin = vine.compile(updateTeamAdminSchema),
    updateTeamTeamAdmin = vine.compile(updateTeamTeamAdminSchema);