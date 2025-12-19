import {Router} from "express";
import {teamValidatorMiddleware} from "@/middlewares/validation/team/validation";
import * as teamController from '@/controllers/team/team';
import {canManageTeam} from "@/middlewares/validation/authorization/team/canManageTeam";
import {isAdmin} from "@/middlewares/auth/isAdmin";

const router : Router = Router();

/**
 * @swagger
 * /team:
 *   get:
 *     tags:
 *       - Team
 *     summary: Get all teams
 *     description: Retrieve a paginated list of all teams with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of teams to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of teams to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for team name (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TeamList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/', isAdmin, teamValidatorMiddleware.teams, teamController.getTeams);

/**
 * @swagger
 * /team/me/teams:
 *   get:
 *     tags:
 *       - Team
 *     summary: Get current user's teams
 *     description: Retrieve a paginated list of teams that the authenticated user is a member of (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of teams to retrieve
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TeamList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/me', teamValidatorMiddleware.myteams, teamController.getMyTeams);

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     tags:
 *       - Team
 *     summary: Get a specific team
 *     description: Retrieve a single team by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', isAdmin, teamValidatorMiddleware.team, teamController.getTeam);

/**
 * @swagger
 * /team:
 *   post:
 *     tags:
 *       - Team
 *     summary: Create a new team
 *     description: Create a new team with members (requires admin).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 title: Admin Request
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Team name (3-100 characters)
 *                   id_member:
 *                     type: number
 *                     description: Member ID who will be the team admin
 *                   team_member:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_member:
 *                           type: number
 *                         accepted:
 *                           type: boolean
 *                     description: Array of team members (optional)
 *                 required:
 *                   - name
 *                   - id_member
 *               - type: object
 *                 title: User Request
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Team name (3-100 characters)
 *                   team_member:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         member:
 *                           type: number
 *                         accepted:
 *                           type: boolean
 *                     description: Array of team members (optional)
 *                 required:
 *                   - name
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid request data or missing required fields
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.post('/', isAdmin, teamValidatorMiddleware.createTeam, teamController.createTeam);

/**
 * @swagger
 * /team:
 *   put:
 *     tags:
 *       - Team
 *     summary: Update a team
 *     description: Update an existing team (requires admin).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 title: Admin Request
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: Team ID to update
 *                   name:
 *                     type: string
 *                     description: Team name (3-100 characters)
 *                   id_member:
 *                     type: number
 *                     description: Team admin member ID
 *                   id_report:
 *                     type: number
 *                     nullable: true
 *                     description: Report ID associated with team (optional)
 *                   team_member:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_member:
 *                           type: number
 *                         accepted:
 *                           type: boolean
 *                     description: Array of team members (optional)
 *                 required:
 *                   - id
 *                   - name
 *                   - id_member
 *               - type: object
 *                 title: User Request (Team Admin)
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: Team ID to update
 *                   name:
 *                     type: string
 *                     description: Team name (3-100 characters)
 *                   id_member:
 *                     type: number
 *                     description: Team admin member ID
 *                   id_report:
 *                     type: number
 *                     nullable: true
 *                     description: Report ID associated with team (optional)
 *                   team_member:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_member:
 *                           type: number
 *                         accepted:
 *                           type: boolean
 *                     description: Array of team members (optional)
 *                 required:
 *                   - id
 *                   - name
 *                   - id_member
 *     responses:
 *       200:
 *         description: Team updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid request data or foreign key constraint violation
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/', isAdmin, teamValidatorMiddleware.updateTeam, teamController.updateTeam);

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     tags:
 *       - Team
 *     summary: Delete a team
 *     description: Delete a team by ID (requires admin).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Team ID to delete
 *     responses:
 *       204:
 *         description: Team deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', isAdmin, teamValidatorMiddleware.team, canManageTeam({ action: "delete" }), teamController.deleteTeam);

export default router;