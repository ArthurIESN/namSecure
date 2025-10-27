export interface IIdValidationStatus
{
    isRequested: boolean;
    isPending: boolean;
    isRejected: boolean;
    message: string;
}