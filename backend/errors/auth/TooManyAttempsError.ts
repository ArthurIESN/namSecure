export class TooManyAttempsError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "TooManyAttempsError";
    }
}
