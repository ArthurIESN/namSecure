import prisma from '../../database/databasePrisma.js';
export const getMemberRoles = async () => {
    try {
        return await prisma.member_role.findMany();
    }
    catch (error) {
        console.error("Error fetching member roles:", error);
        throw error;
    }
};
export const getMemberRole = async (id) => {
    try {
        if (isNaN(id)) {
            throw new Error("Invalid role ID");
        }
        return await prisma.member_role.findUnique({
            where: { id: id }
        });
    }
    catch (error) {
        console.error("Error fetching member role:", error);
        throw error;
    }
};
export const createMemberRole = async (role) => {
    try {
        return await prisma.member_role.create({
            data: role
        });
    }
    catch (error) {
        console.error("Error creating member role:", error);
        throw error;
    }
};
export const updateMemberRole = async (role) => {
    try {
        await prisma.member_role.update({
            where: { id: role.id },
            data: role
        });
    }
    catch (error) {
        console.error("Error updating member role:", error);
        throw error;
    }
};
export const deleteMemberRole = async (id) => {
    try {
        if (isNaN(id)) {
            throw new Error("Invalid role ID");
        }
        await prisma.member_role.delete({
            where: { id: id }
        });
    }
    catch (error) {
        console.error("Error deleting member role:", error);
        throw error;
    }
};
//# sourceMappingURL=member_role.js.map