export class JWTNotDefined extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "JWTNotDefined";
    }
}
