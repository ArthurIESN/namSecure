import {Router} from "express";
import {teamValidatorMiddleware} from "../../middlewares/validation/team/validation.js";
import * as teamController from '../../controllers/team/team.js';
import {isAuthenticated} from "../../middlewares/auth/isAuthenticated.js";
import {canManageTeam} from "../../middlewares/validation/authorization/team/canManageTeam.js";

const router : Router = Router();

router.get('/', isAuthenticated, teamValidatorMiddleware.teams, teamController.getTeams);
router.get('/:id', isAuthenticated,teamValidatorMiddleware.team, teamController.getTeam);
router.post('/', isAuthenticated, teamValidatorMiddleware.createTeam, teamController.createTeam);
router.put('/', isAuthenticated, teamValidatorMiddleware.updateTeam, teamController.updateTeam);
router.delete('/:id', isAuthenticated, teamValidatorMiddleware.team, canManageTeam({ action: "delete" }), teamController.deleteTeam);

export default router;