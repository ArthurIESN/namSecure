import {Router} from "express";
import * as validationCodeController from "@/controllers/validation_code/validation_code.js";
import { validationCodeValidatorMiddleware } from "@/middlewares/validation/validation_code/validation";


const router: Router = Router();

/**
 * @swagger
 * /validation-code:
 *   get:
 *     tags:
 *       - Validation Code
 *     summary: Get all validation codes
 *     description: Retrieve a paginated list of all validation codes with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of codes to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of codes to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ValidationCodeList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get("/", validationCodeValidatorMiddleware.validationCodes, validationCodeController.getValidationCodes);

/**
 * @swagger
 * /validation-code/{id}:
 *   get:
 *     tags:
 *       - Validation Code
 *     summary: Get a specific validation code
 *     description: Retrieve a single validation code by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Validation code ID
 *     responses:
 *       200:
 *         description: Validation code found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationCode'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Validation code not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", validationCodeValidatorMiddleware.validationCode, validationCodeController.getValidationCode);

/**
 * @swagger
 * /validation-code:
 *   post:
 *     tags:
 *       - Validation Code
 *     summary: Create a validation code
 *     description: Create a new validation code for email or ID verification (requires admin)
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
 *               code_hash:
 *                 type: string
 *                 description: The validation code (6 characters)
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration timestamp for the code
 *               attempts:
 *                 type: number
 *                 description: Number of validation attempts allowed (>= 0)
 *             required:
 *               - code_hash
 *               - expires_at
 *               - attempts
 *     responses:
 *       201:
 *         description: Validation code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation code created successfully"
 *       400:
 *         description: Missing required fields or invalid field format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.post("/", validationCodeValidatorMiddleware.createValidationCode, validationCodeController.createValidationCode);

/**
 * @swagger
 * /validation-code:
 *   put:
 *     tags:
 *       - Validation Code
 *     summary: Update a validation code
 *     description: Update an existing validation code (requires admin)
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
 *                 description: Validation code ID to update
 *               code_hash:
 *                 type: string
 *                 description: The validation code (6 characters, optional)
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration timestamp for the code
 *               attempts:
 *                 type: number
 *                 description: Number of validation attempts allowed (>= 0)
 *             required:
 *               - id
 *               - expires_at
 *               - attempts
 *     responses:
 *       200:
 *         description: Validation code updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation code updated successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Validation code not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/", validationCodeValidatorMiddleware.updateValidationCode, validationCodeController.updateValidationCode);

/**
 * @swagger
 * /validation-code/{id}:
 *   delete:
 *     tags:
 *       - Validation Code
 *     summary: Delete a validation code
 *     description: Delete a validation code by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Validation code ID to delete
 *     responses:
 *       200:
 *         description: Validation code deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation code deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Validation code not found
 *       409:
 *         description: Conflict - Cannot delete validation code due to foreign key constraint
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", validationCodeValidatorMiddleware.validationCode, validationCodeController.deleteValidationCode);


export default router;