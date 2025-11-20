export interface IAuthUser
{
    id: number;
    email: string;
    twoFactorVerified: boolean;
}

export interface IAuthMember
{
    first_name: string | null;
    last_name: string | null;
    address: string;
    photo_path: string | null;
    email_checked: boolean;
    id_checked: boolean;
    password_last_update: Date;
    member_2fa:
    {
        is_enabled: boolean;
    } | null,
    member_role :
    {
        name: string;
    }
}