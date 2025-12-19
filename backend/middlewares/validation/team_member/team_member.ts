import vine, {SimpleMessagesProvider} from "@vinejs/vine";
import {GET_MAX_LIMIT} from "../../../utils/constants/constants.js";
import {messages} from "@/middlewares/validation/messageProvider";

const allTeamMembersSchema = vine.object({
    limit: vine.number().positive().withoutDecimals().max(GET_MAX_LIMIT),
    offset: vine.number().withoutDecimals().optional(),
    search: vine.string().optional(),
});


const teamMemberSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});


const membersOfGroupSchema = vine.object({
    idGroup: vine.number().positive().withoutDecimals(),
});

const addTeamMemberSchema = vine.object({
    accepted: vine.boolean(),
    id_team: vine.number().positive().withoutDecimals(),
    id_member: vine.number().positive().withoutDecimals(),
});


const updateTeamMemberSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
    accepted: vine.boolean(),
});


const deleteTeamMemberSchema = vine.object({
    id: vine.number().positive().withoutDecimals(),
});


const fields = {
    'limit': 'limit',
    'offset': 'offset',
    'search': 'search',
    'id': 'team member ID',
    'idGroup': 'group ID',
    'accepted': 'acceptance status',
    'id_team': 'team ID',
    'id_member': 'member ID'
};

vine.messagesProvider = new SimpleMessagesProvider(messages, fields);

export const
    allTeamMembers = vine.compile(allTeamMembersSchema),
    teamMember = vine.compile(teamMemberSchema),
    membersOfGroup = vine.compile(membersOfGroupSchema),
    addTeamMember = vine.compile(addTeamMemberSchema),
    updateTeamMember = vine.compile(updateTeamMemberSchema),
    deleteTeamMember = vine.compile(deleteTeamMemberSchema);
