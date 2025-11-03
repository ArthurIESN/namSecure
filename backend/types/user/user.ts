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
    member_role :
        {
            name: string;
        }
}