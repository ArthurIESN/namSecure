export class JWTVerifiedFailedError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "JWTVerifiedFailedError";
    }
}
