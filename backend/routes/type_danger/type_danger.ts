import {Router} from "express";
import {typeDangerValidatorMiddleware} from "@/middlewares/validation/type_danger/validation";
import * as typeDangerController from "@/controllers/type_danger/type_danger";

const router: Router = Router()

/**
 * @swagger
 * /typeDanger:
 *   get:
 *     tags:
 *       - Type Danger
 *     summary: Get all danger types
 *     description: Retrieve a paginated list of all danger types with optional search
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of types to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of types to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for danger type name (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TypeDangerList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', typeDangerValidatorMiddleware.typeDangers, typeDangerController.getTypeDangers);

/**
 * @swagger
 * /typeDanger/used:
 *   get:
 *     tags:
 *       - Type Danger
 *     summary: Get used danger types
 *     description: Retrieve all danger types that have been used in reports
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TypeDangerList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.get('/used', typeDangerValidatorMiddleware.typeDangersUsed, typeDangerController.getTypeDangersUsed);

/**
 * @swagger
 * /typeDanger/{id}:
 *   get:
 *     tags:
 *       - Type Danger
 *     summary: Get a specific danger type
 *     description: Retrieve a single danger type by ID
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Danger type ID
 *     responses:
 *       200:
 *         description: Danger type found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeDanger'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: TypeDanger not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', typeDangerValidatorMiddleware.typeDanger, typeDangerController.getTypeDanger);

/**
 * @swagger
 * /typeDanger:
 *   post:
 *     tags:
 *       - Type Danger
 *     summary: Create a new danger type
 *     description: Create a new danger type classification
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
 *                 description: Name of the danger type (3-50 characters)
 *               icon:
 *                 type: string
 *                 description: Icon/emoji for the danger type (1-255 characters)
 *               is_used:
 *                 type: boolean
 *                 description: Whether this danger type is being used
 *             required:
 *               - name
 *               - icon
 *               - is_used
 *     responses:
 *       201:
 *         description: Danger type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Danger type created successfully"
 *       400:
 *         description: Missing required fields or invalid field format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post('/', typeDangerValidatorMiddleware.createTypeDanger, typeDangerController.createTypeDanger);

/**
 * @swagger
 * /typeDanger:
 *   put:
 *     tags:
 *       - Type Danger
 *     summary: Update a danger type
 *     description: Update an existing danger type
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
 *                 description: Danger type ID to update
 *               name:
 *                 type: string
 *                 description: Name of the danger type (3-50 characters)
 *               icon:
 *                 type: string
 *                 description: Icon/emoji for the danger type (1-255 characters)
 *               is_used:
 *                 type: boolean
 *                 description: Whether this danger type is being used
 *             required:
 *               - id
 *               - name
 *               - icon
 *               - is_used
 *     responses:
 *       204:
 *         description: Danger type updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Danger type not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/', typeDangerValidatorMiddleware.updateTypeDanger, typeDangerController.updateTypeDanger);

/**
 * @swagger
 * /typeDanger/{id}:
 *   delete:
 *     tags:
 *       - Type Danger
 *     summary: Delete a danger type
 *     description: Delete a danger type by ID
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Danger type ID to delete
 *     responses:
 *       204:
 *         description: Danger type deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Danger type not found
 *       409:
 *         description: Conflict - Cannot delete danger type due to foreign key constraint
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', typeDangerValidatorMiddleware.typeDanger, typeDangerController.deleteTypeDanger);

export default router;