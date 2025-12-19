export interface IMember_2FA
{
    id: number;
    secret_key?: string;
    is_enabled: boolean;
    created_at: Date;
}