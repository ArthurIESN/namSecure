import {Request, Response, NextFunction} from "express";
import vine from "@vinejs/vine";
import {isAppAdmin} from "@utils/auth/authorization";
import * as teamModel from "@/models/team/team";
import {ITeam} from "@namSecure/shared/types/team/team";
import {IMember} from "@namSecure/shared/types/member/member";

interface ConditionalValidationConfig
{
    adminSchema: ReturnType<typeof vine.compile>,
    userSchema: ReturnType<typeof vine.compile>,
    adminRoles?: string[];
    checkTeamAdmin?: boolean;
}


export const roleBasedBodyValidation = (config: ConditionalValidationConfig) => {
    return async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            let useAdminSchema: boolean = false;

            if (isAppAdmin(req.member, config.adminRoles))
            {
                useAdminSchema = true;
            }
            else if (config.checkTeamAdmin && req.validated?.id)
            {
                const team: ITeam = await teamModel.getTeam(req.validated.id);
                const isTeamAdmin: boolean = (team.admin as IMember).id === req.user!.id;

                if (isTeamAdmin)
                {
                    useAdminSchema = true;
                }
            }

            const schema = useAdminSchema ? config.adminSchema : config.userSchema;
            const validatedBody: any = await schema.validate(req.body);

            req.validated = { ...req.validated, ...validatedBody };
            next();
        } catch (error: any)
        {
            if (error.message === "Team not found")
            {
                res.status(404).json({ error: "Team not found" });
            }
            else
            {
                res.status(400).json({
                    error: error.messages?.[0]?.message || 'Validation Error'
                });
            }
        }
    }
}