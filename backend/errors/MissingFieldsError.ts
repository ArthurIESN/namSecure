export class MissingFieldsError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "MissingFieldsError";
    }
}
