import {Router} from "express";
import {teamValidatorMiddleware} from "../../middlewares/validation/team/validation.js";
import * as teamController from '../../controllers/team/team.js';
import {isAuthenticated} from "../../middlewares/auth/isAuthenticated.js";

const router : Router = Router();

router.get('/', teamValidatorMiddleware.teams, teamController.getTeams);
router.get('/:id',teamValidatorMiddleware.team ,teamController.getTeam);
router.post('/',isAuthenticated,teamValidatorMiddleware.createTeam, teamController.createTeam);

export default router;