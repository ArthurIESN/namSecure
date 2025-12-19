import vine, {SimpleMessagesProvider} from "@vinejs/vine";
import {GET_MAX_LIMIT} from "@utils/constants/constants";
import { messages } from "@/middlewares/validation/messageProvider"

const teamsSchema = vine.object({
    limit : vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset : vine.number().nonNegative().withoutDecimals(),
    search: vine.string().optional(),
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
            member: vine.number().positive().withoutDecimals(),
            accepted: vine.boolean()
        })
    ).optional()
});

const updateTeamAdminSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    name: vine.string().minLength(3).maxLength(100),
    id_member: vine.number().positive().withoutDecimals(),
    id_report: vine.number().withoutDecimals().nullable().optional(),
    team_member: vine.array(
        vine.object({
            id_member: vine.number().positive().withoutDecimals(),
            accepted: vine.boolean()
        })
    ).optional()
});

const fields = {
    'limit': 'limit',
    'search': 'search',
    'id': 'id',
    'name': 'name',
    'id_member': 'member ID',
    'id_report': 'report ID',
    'team_member': 'team members',
    'accepted': 'accepted status'
};

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    teams = vine.compile(teamsSchema),
    team = vine.compile(teamSchema),
    createTeamAdmin = vine.compile(createTeamAdminSchema),
    createTeamUser = vine.compile(createTeamUserSchema),
    updateTeamAdmin = vine.compile(updateTeamAdminSchema),
    updateTeamTeamAdmin = vine.compile(updateTeamAdminSchema);