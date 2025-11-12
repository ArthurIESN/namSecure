export class RegisterError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "RegisterError";
    }
}
