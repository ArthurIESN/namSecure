import { Router } from "express";
import { teamMemberValidatorMiddleware } from "../../middlewares/validation/team_member/validation.js";
import * as teamMemberController from '../../controllers/team_member/team_member.js';

const router: Router = Router();

router.get('/',
    teamMemberValidatorMiddleware.allTeamMembers,
    teamMemberController.getAllTeamMembers
);

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


router.delete('/:id',
    teamMemberValidatorMiddleware.deleteTeamMember,
    teamMemberController.deleteTeamMember
);

export default router;
