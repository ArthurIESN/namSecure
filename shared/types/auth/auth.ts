export interface IIdValidationStatus
{
    isRequested: boolean;
    isPending: boolean;
    isRejected: boolean;
    message: string;
}

export interface IAuthUserInfo
{
    firstName: string;
    lastName: string;
    address: string;
    photoPath: string | null;
    email: string;
    emailVerified: boolean;
    idVerified: boolean;
    twoFactorEnabled: boolean;
    twoFactorValidated: boolean;
    //@todo may add more fields later like first name, last name, roles, etc.
}

export interface IAuthTwoFactor
{
    secret: string,
    qrCode: string,
}