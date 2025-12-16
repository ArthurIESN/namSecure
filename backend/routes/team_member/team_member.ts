import { Router } from "express";
import { teamMemberValidatorMiddleware } from "../../middlewares/validation/team_member/validation.js";
import * as teamMemberController from '../../controllers/team_member/team_member.js';
//@todo update imports

const router: Router = Router();

router.get('/',
    teamMemberValidatorMiddleware.allTeamMembers,
    teamMemberController.getAllTeamMembers
);

//@todo ????? use the team_member id
router.get('/group/:idGroup',
    teamMemberValidatorMiddleware.membersOfGroup,
    teamMemberController.getMembersOfGroup
);

/*router.get('/:id',
    teamMemberValidatorMiddleware.teamMember,
    teamMemberController.getTeamMember
);*/


router.post('/',
    teamMemberValidatorMiddleware.addTeamMember,
    teamMemberController.createTeamMember
);


router.put('/',
    teamMemberValidatorMiddleware.updateTeamMember,
    teamMemberController.updateTeamMember
);

//@todo ????? use the team_member id
router.delete('/:id_group/:id_member',
    teamMemberValidatorMiddleware.deleteTeamMember,
    teamMemberController.deleteTeamMember
);

export default router;
