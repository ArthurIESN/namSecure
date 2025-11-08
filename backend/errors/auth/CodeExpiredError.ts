export class CodeExpiredError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "CodeExpiredError";
    }
}
