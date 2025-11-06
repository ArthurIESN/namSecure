export interface IIdValidationStatus
{
    isRequested: boolean;
    isPending: boolean;
    isRejected: boolean;
    message: string;
}

export interface IAuthUserInfo
{
    email: string;
    emailVerified: boolean;
    idVerified: boolean;
    twoFactorEnabled?: boolean;
    //@todo may add more fields later like first name, last name, roles, etc.
}

export interface IAuthTwoFactor
{
    secret: string,
    qrCode: string,
}