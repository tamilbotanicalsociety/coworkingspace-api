const express = require('express');
const {
    getCoworkingSpaces, 
    getCoworkingSpace, 
    createCoworkingSpace, 
    updateCoworkingSpace, 
    deleteCoworkingSpace
} = require('../controllers/Coworkingspace');

// Include other resource routers
const bookingRouter = require('./bookings');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CoworkingSpace:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - tel
 *         - OpenTime
 *         - CloseTime
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the coworking space
 *           example: 609bda561452242d88d36e37
 *         name:
 *           type: string
 *           description: Coworking space name
 *           example: CU Coworking Space
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *           example: 254 Phayathai Road, Wang Mai, Pathum Wan, Bangkok
 *         tel:
 *           type: string
 *           description: Telephone number
 *           example: 02-215-0830
 *         OpenTime:
 *           type: string
 *           description: Opening time in HH:mm format
 *           example: "08:00"
 *         CloseTime:
 *           type: string
 *           description: Closing time in HH:mm format
 *           example: "20:00"
 */

/**
 * @swagger
 * tags:
 *   name: CoworkingSpaces
 *   description: The coworking spaces managing API
 */

/**
 * @swagger
 * /coworkingspace:
 *   get:
 *     summary: Returns the list of all the coworking spaces
 *     tags: [CoworkingSpaces]
 *     responses:
 *       200:
 *         description: The list of the coworking spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CoworkingSpace'
 *   post:
 *     summary: Create a new coworking space
 *     tags: [CoworkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoworkingSpace'
 *     responses:
 *       201:
 *         description: The coworking space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoworkingSpace'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /coworkingspace/{id}:
 *   get:
 *     summary: Get the coworking space by id
 *     tags: [CoworkingSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     responses:
 *       200:
 *         description: The coworking space description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoworkingSpace'
 *       404:
 *         description: The coworking space was not found
 *   put:
 *     summary: Update the coworking space by id
 *     tags: [CoworkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoworkingSpace'
 *     responses:
 *       200:
 *         description: The coworking space was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoworkingSpace'
 *       404:
 *         description: The coworking space was not found
 *   delete:
 *     summary: Remove the coworking space by id (cascade deletes bookings)
 *     tags: [CoworkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     responses:
 *       200:
 *         description: The coworking space was deleted
 *       404:
 *         description: The coworking space was not found
 */

// Re-route into booking resource
router.use('/:coworkingspaceId/bookings', bookingRouter);

router.route('/')
    .get(getCoworkingSpaces)
    .post(protect, authorize('admin'), createCoworkingSpace);

router.route('/:id')
    .get(getCoworkingSpace)
    .put(protect, authorize('admin'), updateCoworkingSpace)
    .delete(protect, authorize('admin'), deleteCoworkingSpace);

module.exports = router;