import { Router } from "express";
import { teamMemberValidatorMiddleware } from "@/middlewares/validation/team_member/validation.js";
import * as teamMemberController from '@/controllers/team_member/team_member.js';


const router: Router = Router();


router.get('/pending',
    teamMemberController.getPendingInvitations
);

/**
 * @swagger
 * /team-member:
 *   get:
 *     tags:
 *       - Team Member
 *     summary: Get all team members
 *     description: Retrieve a paginated list of all team members with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of team members to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: Number of team members to skip for pagination (optional)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TeamMemberList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to fetch team members
 */
router.get('/',
    teamMemberValidatorMiddleware.allTeamMembers,
    teamMemberController.getAllTeamMembers
);

/**
 * @swagger
 * /team-member:
 *   post:
 *     tags:
 *       - Team Member
 *     summary: Add a member to a team
 *     description: Add a new member to an existing team (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_team:
 *                 type: number
 *                 description: Team ID
 *               id_member:
 *                 type: number
 *                 description: Member ID to add to the team
 *               accepted:
 *                 type: boolean
 *                 description: Whether the member has accepted the team invitation
 *             required:
 *               - id_team
 *               - id_member
 *               - accepted
 *     responses:
 *       201:
 *         description: Team member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team member created successfully"
 *       400:
 *         description: Invalid request data or error creating team member
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to create team member
 */
router.post('/',
    teamMemberValidatorMiddleware.addTeamMember,
    teamMemberController.createTeamMember
);

/**
 * @swagger
 * /team-member:
 *   put:
 *     tags:
 *       - Team Member
 *     summary: Update a team member
 *     description: Update a team member's acceptance status (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: Team member ID to update
 *               accepted:
 *                 type: boolean
 *                 description: New acceptance status
 *             required:
 *               - id
 *               - accepted
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team member updated successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Failed to update team member
 */
router.put('/',
    teamMemberValidatorMiddleware.updateTeamMember,
    teamMemberController.updateTeamMember
);

/**
 * @swagger
 * /team-member/{id}:
 *   delete:
 *     tags:
 *       - Team Member
 *     summary: Remove a member from a team
 *     description: Delete a team member entry (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Team member ID to delete
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team member deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to delete team member
 */
router.delete('/:id',
    teamMemberValidatorMiddleware.deleteTeamMember,
    teamMemberController.deleteTeamMember
);

/**
 * @swagger
 * /team-member/pending:
 *   get:
 *     tags:
 *       - Team Member
 *     summary: Get pending team invitations
 *     description: Retrieve team member invitations that haven't been accepted yet for the current user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TeamMemberList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Failed to fetch pending invitations
 */


/**
 * @swagger
 * /team-member/accept/{id}:
 *   put:
 *     tags:
 *       - Team Member
 *     summary: Accept a team invitation
 *     description: Accept a team member invitation by setting accepted to true
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Team member ID to accept
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invitation accepted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Team member invitation not found
 *       500:
 *         description: Failed to accept invitation
 */
router.put('/accept/:id',
    teamMemberValidatorMiddleware.deleteTeamMember,
    teamMemberController.acceptInvitation
);

export default router;
