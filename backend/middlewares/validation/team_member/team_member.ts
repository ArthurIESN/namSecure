import vine from "@vinejs/vine";

const allTeamMembersSchema = vine.object({});


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

export const
    allTeamMembers = vine.compile(allTeamMembersSchema),
    teamMember = vine.compile(teamMemberSchema),
    membersOfGroup = vine.compile(membersOfGroupSchema),
    addTeamMember = vine.compile(addTeamMemberSchema),
    updateTeamMember = vine.compile(updateTeamMemberSchema),
    deleteTeamMember = vine.compile(deleteTeamMemberSchema);
