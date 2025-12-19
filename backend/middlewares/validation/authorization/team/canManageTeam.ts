import { Request, Response, NextFunction } from "express";
import * as teamModel from "@/models/team/team.js";
import { isAppAdmin } from "@/utils/auth/authorization.js";
import { ITeam } from "@namSecure/shared/types/team/team.js";
import { IMember } from "@namSecure/shared/types/member/member.js";

export const canManageTeam = (options: { action?: string } = {}) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id }: {id: number} = req.validated;
            const action: string = options.action || "manage";

            if (isAppAdmin(req.member)) {
                next();
                return;
            }

            const team: ITeam = await teamModel.getTeam(id);
            const isTeamAdmin: boolean = (team.admin as IMember).id === req.user!.id;

            if (isTeamAdmin) {
                next();
                return;
            }

            res.status(403).json({
                error: `Forbidden: You must be the team admin or an app administrator to ${action} this team`
            });
        } catch (error: any) {
            console.error("Authorization error:", error);

            if (error.message === "Team not found") {
                res.status(404).json({ error: "Team not found" });
            } else {
                res.status(500).json({ error: "Internal server error during authorization check" });
            }
        }
    };
};
