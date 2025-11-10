import { Request, Response, NextFunction } from "express";
import * as teamModel from "../../../../models/team/team.js";
import { isAppAdmin } from "../../../../utils/auth/authorization.js";

export const canManageTeam = (options: { action?: string } = {}) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.validated;
            const action = options.action || "manage";

            if (isAppAdmin(req.member)) {
                next();
                return;
            }

            const team = await teamModel.getTeam(id);
            const isTeamAdmin = team.admin.id === req.user!.id;

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
