import * as member_roleModel from '../../models/member_role/member_role.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { InvalidIdError } from "../../errors/InvalidIdError.js";
import { ForeignKeyConstraintError } from "../../errors/ForeignKeyConstraintError.js";
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
        await member_roleModel.deleteMemberRole(id);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        }
        else if (error instanceof InvalidIdError) {
            res.status(400).json({ error: error.message });
        }
        else if (error instanceof ForeignKeyConstraintError) {
            res.status(409).json({ error: error.message });
        }
        else {
            console.error("Error in deleteMemberRole controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
//# sourceMappingURL=member_role.js.map