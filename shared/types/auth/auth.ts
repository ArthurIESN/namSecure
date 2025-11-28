export interface IIdValidationStatus
{
    isRequested: boolean;
    isPending: boolean;
    isRejected: boolean;
    message: string;
}

export interface IAuthUserInfo
{
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    photoName?: string | null;
    photoPath: string | null;
    email: string;
    emailVerified: boolean;
    idVerified: boolean;
    twoFactorEnabled: boolean;
    twoFactorValidated: boolean;
}

export interface IAuthTwoFactor
{
    secret: string,
    qrCode: string,
}