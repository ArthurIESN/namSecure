import type { IMember_2FA} from "../member_2fa/member_2fa.js";
import type { IMemberRole } from "../member_role/member_role.js";
import type { IMemberIdCheck } from "../member_id_check/member_id_check.js";
import type {IValidationCode} from "../validation_code/validation_code.js";

export interface IMember
{
    id: number;
    apple_id: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string;
    email_checked: boolean;
    id_checked: boolean;
    password: string | null;
    password_last_update: Date;
    photo_path: string | null;
    address: string;
    birthday: Date | null;
    national_registry: string | null;
    created_at: Date;
    twoFA: IMember_2FA | number |  null;
    role: IMemberRole | number;
    id_check: IMemberIdCheck | number | null;
    validation_code: IValidationCode | number | null;
}