import {NextFunction, Request, Response} from "express";
import * as teamValidator from './team.js';
import {roleBasedBodyValidation} from "../authorization/roleBasedValidation.js";
import {isAppAdmin} from "../../../utils/auth/authorization.js";

export const teamValidatorMiddleware = {
    teams: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!isAppAdmin(req.member)) {
                res.status(403).json({
                    error: "Forbidden: Only app administrators can list all teams"
                });
                return;
            }

            req.validated = await teamValidator.teams.validate(req.query);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    team: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamValidator.team.validate(req.params);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    myteams: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamValidator.teams.validate(req.query);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    createTeam: roleBasedBodyValidation({
        adminSchema: teamValidator.createTeamAdmin,
        userSchema: teamValidator.createTeamUser,
    }),

    updateTeam: roleBasedBodyValidation({
        adminSchema: teamValidator.updateTeamAdmin,
        userSchema: teamValidator.updateTeamTeamAdmin,
        checkTeamAdmin: true
    })

};