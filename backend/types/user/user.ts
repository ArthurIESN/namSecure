export interface IAuthUser
{
    id: number;
    email: string;
}

export interface IAuthMember
{
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