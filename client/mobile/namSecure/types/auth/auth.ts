export interface IAuthLoginBiometric
{
    email: string;
    password: string;
}

export enum EAuthState
{
    NOT_AUTHENTICATED,
    EMAIL_NOT_VERIFIED,
    ID_CARD_NOT_VERIFIED,
    TWO_FACTOR_NOT_VERIFIED,
    FULLY_AUTHENTICATED
}
