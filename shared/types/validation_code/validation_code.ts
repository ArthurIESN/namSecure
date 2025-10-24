export interface IValidationCode
{
    id: number;
    code_hash: string;
    expires_at: Date;
    attempts: number;
}