import { NextFunction, Request, Response } from "express";
import * as teamMemberValidator from './team_member.js';

export const teamMemberValidatorMiddleware = {
    allTeamMembers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamMemberValidator.allTeamMembers.validate(req.query);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    teamMember: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamMemberValidator.teamMember.validate(req.params);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    membersOfGroup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamMemberValidator.membersOfGroup.validate(req.params);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    addTeamMember: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamMemberValidator.addTeamMember.validate(req.body);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    updateTeamMember: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamMemberValidator.updateTeamMember.validate(req.body);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    },

    deleteTeamMember: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validated = await teamMemberValidator.deleteTeamMember.validate(req.params);
            next();
        } catch(error: any) {
            res.status(400).send({error: error.messages[0].message});
        }
    }
};
