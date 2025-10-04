export class ForeignKeyConstraintError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "ForeignKeyConstraintError";
    }
}
