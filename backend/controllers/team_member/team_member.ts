import * as member_groupModel from "../../models/team_member/team_member.js";


export const addMemberToGroup = async (req: any, res: any) => {
    try {
        const {id_group, id_member} = req.validated;
        await member_groupModel.addMemberToGroup(id_group, id_member);
        res.status(201).json({ message: "Member added to group successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
        console.error("Error in addMemberToGroup controller:", error);
    }
}
