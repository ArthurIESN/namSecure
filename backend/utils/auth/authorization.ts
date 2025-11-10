import { APP_ADMIN_ROLES } from "../constants/constants.js";
import { IAuthMember } from "../../types/user/user.js";

export const isAppAdmin = (member: IAuthMember | undefined | null, customRoles?: string[]): boolean => {
    if (!member?.member_role?.name) {
        return false;
    }

    const rolesToCheck = customRoles || APP_ADMIN_ROLES;
    return rolesToCheck.includes(member.member_role.name);
};


export const hasRole = (member: IAuthMember | undefined | null, role: string): boolean => {
    return member?.member_role?.name === role;
};


export const hasAnyRole = (member: IAuthMember | undefined | null, roles: string[]): boolean => {
    if (!member?.member_role?.name) {
        return false;
    }

    return roles.includes(member.member_role.name);
};
