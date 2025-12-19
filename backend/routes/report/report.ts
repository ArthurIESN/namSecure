import {Router} from "express";
import {reportValidatorMiddleware} from "@/middlewares/validation/report/validation";
import * as reportController from "@/controllers/report/report";
import {upload} from "@/utils/upload/upload";
import {isAdmin} from "@/middlewares/auth/isAdmin";

const router: Router = Router()

/**
 * @swagger
 * /report:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get all reports
 *     description: Retrieve a paginated list of all reports with optional search (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum number of reports to retrieve
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *         description: Number of reports to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for street name (optional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReportList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/', isAdmin, reportValidatorMiddleware.reports, reportController.getReports);

/**
 * @swagger
 * /report/forUser:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get reports for current user
 *     description: Retrieve all reports created by the authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReportList'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal Server Error
 */
router.get('/forUser',reportController.getReportsForUser);

/**
 * @swagger
 * /report/{id}:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get a specific report
 *     description: Retrieve a single report by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', isAdmin, reportValidatorMiddleware.report, reportController.getReport);

/**
 * @swagger
 * /report:
 *   post:
 *     tags:
 *       - Report
 *     summary: Create a new report
 *     description: Create a new danger report with optional photo
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
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Report date (optional, defaults to current date). Admin only.
 *               lat:
 *                 type: number
 *                 description: Latitude of the danger location
 *               lng:
 *                 type: number
 *                 description: Longitude of the danger location
 *               street:
 *                 type: string
 *                 description: Street address of the danger (1-255 characters)
 *               level:
 *                 type: number
 *                 description: Danger level (integer)
 *               is_public:
 *                 type: boolean
 *                 description: Whether the report is public or team-only
 *               for_police:
 *                 type: boolean
 *                 description: Whether the report should be sent to police
 *               id_member:
 *                 type: number
 *                 description: Member ID who created the report (optional, defaults to current user). Admin only.
 *               id_type_danger:
 *                 type: number
 *                 description: Type of danger ID
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Photo of the danger (optional)
 *             required:
 *               - lat
 *               - lng
 *               - street
 *               - level
 *               - is_public
 *               - for_police
 *               - id_type_danger
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ReportCreated'
 *       400:
 *         description: Invalid request data or missing required fields
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Conflict - Invalid type danger or member reference
 *       500:
 *         description: Internal Server Error
 */
router.post('/', upload.single('file'), reportValidatorMiddleware.createReport, reportController.createReport);

/**
 * @swagger
 * /report:
 *   put:
 *     tags:
 *       - Report
 *     summary: Update a report
 *     description: Update an existing report (requires admin)
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
 *                 description: Report ID to update
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Report date
 *               lat:
 *                 type: number
 *                 description: Latitude of the danger location
 *               lng:
 *                 type: number
 *                 description: Longitude of the danger location
 *               street:
 *                 type: string
 *                 description: Street address of the danger (1-255 characters)
 *               level:
 *                 type: number
 *                 description: Danger level (integer)
 *               is_public:
 *                 type: boolean
 *                 description: Whether the report is public or team-only
 *               for_police:
 *                 type: boolean
 *                 description: Whether the report should be sent to police
 *               photo_path:
 *                 type: string
 *                 description: Photo path (optional, nullable)
 *               id_member:
 *                 type: number
 *                 description: Member ID who created the report
 *               id_type_danger:
 *                 type: number
 *                 description: Type of danger ID
 *             required:
 *               - id
 *               - date
 *               - lat
 *               - lng
 *               - street
 *               - level
 *               - is_public
 *               - for_police
 *               - id_member
 *               - id_type_danger
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReportUpdated'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Report not found
 *       409:
 *         description: Conflict - Invalid type danger or member reference
 *       500:
 *         description: Internal Server Error
 */
router.put('/',  isAdmin, reportValidatorMiddleware.updateReport, reportController.updateReport);

/**
 * @swagger
 * /report/{id}:
 *   delete:
 *     tags:
 *       - Report
 *     summary: Delete a report
 *     description: Delete a report by ID (requires admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Report ID to delete
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReportDeleted'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Report not found
 *       409:
 *         description: Conflict - Cannot delete report due to foreign key constraint
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', isAdmin, reportValidatorMiddleware.report, reportController.deleteReport);

export default router;