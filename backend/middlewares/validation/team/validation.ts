import {NextFunction, Request, Response} from "express";
import * as teamValidator from './team.js';
import {roleBasedBodyValidation} from "../authorization/roleBasedValidation.js";

export const teamValidatorMiddleware = {
    teams: async (req: Request, res: Response, next: NextFunction) => {
        try {
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

    createTeam: roleBasedBodyValidation({
        adminSchema: teamValidator.createTeamAdmin,
        userSchema: teamValidator.createTeamUser,
    })

};