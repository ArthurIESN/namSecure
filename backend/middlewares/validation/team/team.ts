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
    id_admin : vine.number().optional(), // Seule l'admin peut spécifier un id_admin de la team
    memberIds : vine.array(vine.number()).optional()
});

const createTeamUserSchema = vine.object({
    name: vine.string().minLength(3).maxLength(100),
    memberIds: vine.array(vine.number()).optional()
});

export const
    teams = vine.compile(teamsSchema),
    team = vine.compile(teamSchema),
    createTeamAdmin = vine.compile(createTeamAdminSchema),
    createTeamUser = vine.compile(createTeamUserSchema);