
import {Request, Response, NextFunction} from "express";
import {Vine} from "@vinejs/vine";
import {isAppAdmin} from "../../../utils/auth/authorization.js";
import * as teamModel from "../../../models/team/team.js";

interface ConditionalValidationConfig {
    adminSchema: Vine.Validator<any, any>,
    userSchema: Vine.Validator<any, any>,
    adminRoles?: string[];
    checkTeamAdmin?: boolean;
}

export const roleBasedBodyValidation = (config: ConditionalValidationConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let useAdminSchema = false;

            if (isAppAdmin(req.member, config.adminRoles)) {
                useAdminSchema = true;
            }
            else if (config.checkTeamAdmin && req.validated?.id) {
                const team = await teamModel.getTeam(req.validated.id);
                const isTeamAdmin = team.admin.id === req.user!.id;

                if (isTeamAdmin) {
                    useAdminSchema = true;
                }
            }

            const schema = useAdminSchema ? config.adminSchema : config.userSchema;
            const validatedBody = await schema.validate(req.body);

            req.validated = { ...req.validated, ...validatedBody };
            next();
        } catch (error: any) {
            if (error.message === "Team not found") {
                res.status(404).json({ error: "Team not found" });
            } else {
                res.status(400).json({
                    error: error.messages?.[0]?.message || 'Validation Error'
                });
            }
        }
    }
}