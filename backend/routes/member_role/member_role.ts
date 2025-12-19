import { Router } from 'express';
import { memberRoleValidatorMiddleware } from "@/middlewares/validation/member_role/validation"
import * as memberRoleController from '@/controllers/member_role/member_role.js';

const router: Router = Router();

/**
 * @swagger
 * /memberRole:
 *   get:
 *     tags:
 *       - Member Role
 *     summary: Get all member roles
 *     description: Retrieve a paginated list of all member roles with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of roles to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of roles to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for role name (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberRoleList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/', memberRoleValidatorMiddleware.memberRoles, memberRoleController.getMemberRoles);

/**
 * @swagger
 * /memberRole/{id}:
 *   get:
 *     tags:
 *       - Member Role
 *     summary: Get a specific member role
 *     description: Retrieve a single member role by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Member role ID
 *     responses:
 *       200:
 *         description: Member role found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberRole'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member role not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', memberRoleValidatorMiddleware.memberRole, memberRoleController.getMemberRole);

/**
 * @swagger
 * /memberRole:
 *   post:
 *     tags:
 *       - Member Role
 *     summary: Create a new member role
 *     description: Create a new member role with the provided name (requires admin)
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
 *               name:
 *                 type: string
 *                 description: Name of the role
 *             required:
 *               - name
 *     responses:
 *       201:
 *         $ref: '#/components/responses/MemberRoleCreated'
 *       400:
 *         description: Missing required fields
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.post('/', memberRoleValidatorMiddleware.createMemberRole, memberRoleController.createMemberRole);

/**
 * @swagger
 * /memberRole:
 *   put:
 *     tags:
 *       - Member Role
 *     summary: Update a member role
 *     description: Update an existing member role (requires admin)
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
 *                 description: ID of the role to update
 *               name:
 *                 type: string
 *                 description: New name for the role
 *             required:
 *               - id
 *               - name
 *     responses:
 *       204:
 *         $ref: '#/components/responses/MemberRoleUpdated'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member role not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/', memberRoleValidatorMiddleware.updateMemberRole, memberRoleController.updateMemberRole);

/**
 * @swagger
 * /memberRole/{id}:
 *   delete:
 *     tags:
 *       - Member Role
 *     summary: Delete a member role
 *     description: Delete an existing member role by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Member role ID to delete
 *     responses:
 *       204:
 *         $ref: '#/components/responses/MemberRoleDeleted'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member role not found
 *       409:
 *         description: Cannot delete role due to foreign key constraint
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', memberRoleValidatorMiddleware.memberRole, memberRoleController.deleteMemberRole);

export default router;
