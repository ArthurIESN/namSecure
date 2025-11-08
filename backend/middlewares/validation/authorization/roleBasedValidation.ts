
// middlewares/validation/authorization/roleBasedValidation.ts
import {Request, Response, NextFunction} from "express";
import {Vine} from "@vinejs/vine";

interface ConditionalValidationConfig {
    adminSchema: Vine.Validator<any, any>,
    userSchema: Vine.Validator<any, any>,
    adminRoles?: string[];
}

export const roleBasedBodyValidation = (config: ConditionalValidationConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const adminRoles = config.adminRoles || ['admin', 'superadmin'];
        const isAdmin = req.member!.member_role?.name && adminRoles.includes(req.member!.member_role.name);

        try {
            const schema = isAdmin ? config.adminSchema : config.userSchema;
            req.validated = await schema.validate(req.body);
            next();
        } catch (error: any) {
            res.status(400).json({
                error: error.messages?.[0]?.message || 'Validation Error'
            });
        }
    }
}