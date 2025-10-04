import type { IMember_2FA} from "../member_2fa/member_2fa.js";
import type { IMemberRole } from "../member_role/member_role.js";
import type { IMemberIdCheck } from "../member_id_check/member_id_check.js";

export interface IMember
{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_checked: boolean;
    id_checked: boolean;
    password: string;
    password_last_update: Date;
    address: string;
    birthday: Date;
    national_registry: string;
    created_at: Date;
    twoFA?: IMember_2FA;
    role?: IMemberRole;
    id_check?: IMemberIdCheck;

}