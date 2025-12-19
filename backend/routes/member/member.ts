import { Router } from 'express';
import { memberValidatorMiddleware } from '@/middlewares/validation/member/validation';
import * as memberController from '@/controllers/member/member';
import * as profileController from '@/controllers/member/profile';
import * as emailController from '@/controllers/member/email';
import passwordRouter from './password.js';
import {isAdmin} from "@/middlewares/auth/isAdmin";
import {isAuthenticated} from "@/middlewares/auth/isAuthenticated";
import {isFullyAuthenticated} from "@/middlewares/auth/isFullyAuthenticated";
import {refreshToken} from "@/middlewares/auth/refreshToken";
import { upload } from '@/utils/upload/upload';

const router : Router = Router();

/**
 * @swagger
 * /member/profile:
 *   put:
 *     tags:
 *       - Member
 *     summary: Update member profile
 *     description: Update authenticated member's profile information with optional profile photo
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo (JPEG or PNG image, optional)
 *               first_name:
 *                 type: string
 *                 description: Member first name (optional)
 *               last_name:
 *                 type: string
 *                 description: Member last name (optional)
 *               address:
 *                 type: string
 *                 description: Member address (optional)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       400:
 *         description: Invalid file format or request data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.put(
    '/profile',
    isAuthenticated,
    upload.single('profilePhoto'),
    profileController.updateProfile
);


router.put(
    '/email',
    isAuthenticated,
    isFullyAuthenticated,
    memberValidatorMiddleware.emailChange,
    emailController.changeEmail
);
/**
 * @swagger
 * /member:
 *   get:
 *     tags:
 *       - Member
 *     summary: Get all members
 *     description: Retrieve a paginated list of all members with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of members to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of members to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for email (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/',isAuthenticated, isAdmin,  memberValidatorMiddleware.members, memberController.getMembers);

/**
 * @swagger
 * /member/me:
 *   get:
 *     tags:
 *       - Member
 *     summary: Get current user information
 *     description: Retrieve the current authenticated user's information including profile details
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AuthUserInfoResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/me',isAuthenticated,  refreshToken, memberController.me);

/**
 * @swagger
 * /member/search-for-team:
 *   get:
 *     tags:
 *       - Member
 *     summary: Search members for team assignment
 *     description: Search for members who can be added to a team (members in less than 2 teams)
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for first name, last name, or address
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberList'
 *       500:
 *         description: Internal Server Error
 */
router.get('/search-for-team',isAuthenticated,  memberValidatorMiddleware.searchForTeam, memberController.searchMembersForTeam);

/**
 * @swagger
 * /member/{id}:
 *   get:
 *     tags:
 *       - Member
 *     summary: Get a specific member
 *     description: Retrieve a single member by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id',isAuthenticated, isAdmin, memberValidatorMiddleware.member, memberController.getMember);

/**
 * @swagger
 * /member:
 *   post:
 *     tags:
 *       - Member
 *     summary: Create a new member
 *     description: Create a new member account (requires admin)
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
 *               apple_id:
 *                 type: string
 *                 description: Apple ID (nullable)
 *               first_name:
 *                 type: string
 *                 description: First name (letters only, 2-50 characters)
 *               last_name:
 *                 type: string
 *                 description: Last name (letters only, 2-50 characters)
 *               email:
 *                 type: string
 *                 description: Email address
 *               email_checked:
 *                 type: boolean
 *                 description: Email verification status
 *               id_checked:
 *                 type: boolean
 *                 description: ID verification status
 *               password:
 *                 type: string
 *                 description: Account password
 *               password_last_update:
 *                 type: string
 *                 format: date-time
 *                 description: Last password update timestamp
 *               address:
 *                 type: string
 *                 description: Member address
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 description: Date of birth (nullable)
 *               national_registry:
 *                 type: string
 *                 description: National registry number (15 characters, nullable)
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Account creation timestamp
 *               photo_path:
 *                 type: string
 *                 description: Profile photo path (nullable)
 *               id_role:
 *                 type: number
 *                 description: Member role ID
 *               id_2fa:
 *                 type: number
 *                 description: Two-factor authentication ID (nullable)
 *               id_id_check:
 *                 type: number
 *                 description: ID check configuration ID (nullable)
 *               id_validation_code:
 *                 type: number
 *                 description: Validation code ID (nullable)
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - email_checked
 *               - id_checked
 *               - password
 *               - password_last_update
 *               - address
 *               - created_at
 *               - id_role
 *     responses:
 *       201:
 *         $ref: '#/components/responses/MemberCreated'
 *       400:
 *         description: Missing required fields or invalid field format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict - Email or national registry already exists, or invalid role/foreign key reference
 *       500:
 *         description: Internal Server Error
 */
router.post('/', isAuthenticated, isAdmin, memberValidatorMiddleware.createMember, memberController.createMember);

/**
 * @swagger
 * /member:
 *   put:
 *     tags:
 *       - Member
 *     summary: Update a member
 *     description: Update an existing member (requires admin)
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
 *                 description: Member ID to update
 *               apple_id:
 *                 type: string
 *                 description: Apple ID (nullable)
 *               first_name:
 *                 type: string
 *                 description: First name (letters only, 2-50 characters)
 *               last_name:
 *                 type: string
 *                 description: Last name (letters only, 2-50 characters)
 *               email:
 *                 type: string
 *                 description: Email address
 *               email_checked:
 *                 type: boolean
 *                 description: Email verification status
 *               id_checked:
 *                 type: boolean
 *                 description: ID verification status
 *               password:
 *                 type: string
 *                 description: Account password (optional, send empty string to keep existing)
 *               password_last_update:
 *                 type: string
 *                 format: date-time
 *                 description: Last password update timestamp
 *               address:
 *                 type: string
 *                 description: Member address
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 description: Date of birth (optional, nullable)
 *               national_registry:
 *                 type: string
 *                 description: National registry number (15 characters, nullable)
 *               photo_path:
 *                 type: string
 *                 description: Profile photo path (nullable)
 *               id_role:
 *                 type: number
 *                 description: Member role ID
 *               id_2fa:
 *                 type: number
 *                 description: Two-factor authentication ID (nullable)
 *               id_id_check:
 *                 type: number
 *                 description: ID check configuration ID (nullable)
 *               id_validation_code:
 *                 type: number
 *                 description: Validation code ID (nullable)
 *             required:
 *               - id
 *               - first_name
 *               - last_name
 *               - email
 *               - email_checked
 *               - id_checked
 *               - password_last_update
 *               - address
 *               - id_role
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberUpdated'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 *       409:
 *         description: Conflict - Email or national registry already exists, or invalid role/foreign key reference
 *       500:
 *         description: Internal Server Error
 */
router.put('/',isAuthenticated, isAdmin, memberValidatorMiddleware.updateMember, memberController.updateMember);

/**
 * @swagger
 * /member/{id}:
 *   delete:
 *     tags:
 *       - Member
 *     summary: Delete a member
 *     description: Delete a member by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Member ID to delete
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MemberDeleted'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', isAuthenticated,isAdmin,  memberValidatorMiddleware.member, memberController.deleteMember);


router.use('/password', passwordRouter);

export default router;