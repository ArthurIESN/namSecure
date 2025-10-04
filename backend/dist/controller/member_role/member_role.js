import * as member_roleModel from '../../model/member_role/member_role.js';
export const getMemberRoles = async (_req, res) => {
    try {
        const memberRoles = await member_roleModel.getMemberRoles();
        res.send(memberRoles);
    }
    catch (error) {
        console.error("Error in getMemberRoles controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getMemberRole = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid role ID" });
            return;
        }
        const memberRole = await member_roleModel.getMemberRole(id);
        if (memberRole) {
            res.send(memberRole);
        }
        else {
            res.status(404).json({ error: "Member role not found" });
        }
    }
    catch (error) {
        console.error("Error in getMemberRole controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const createMemberRole = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const role = {
            name: name
        };
        const newRole = await member_roleModel.createMemberRole(role);
        res.status(201).json(newRole);
    }
    catch (error) {
        console.error("Error in createMemberRole controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const updateMemberRole = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name } = req.body;
        if (isNaN(id) || !name) {
            res.status(400).json({ error: "Invalid input" });
            return;
        }
        const role = {
            id: id,
            name: name
        };
        await member_roleModel.updateMemberRole(role);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in updateMemberRole controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteMemberRole = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid role ID" });
        }
        await member_roleModel.deleteMemberRole(id);
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Role not found' });
        }
        else {
            console.error("Error in deleteMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
//# sourceMappingURL=member_role.js.map