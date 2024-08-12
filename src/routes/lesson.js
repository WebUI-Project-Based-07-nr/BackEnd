const router = require('express').Router()

const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')

const Lesson = require('~/models/lesson')
const lessonController = require('~/controllers/lesson')


const params = [{ model: Lesson, idName: 'id' }]

router.use(authMiddleware)

router.param('id', idValidation)

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lesson]
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetLessonsResponse'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(lessonController.getLessons))

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lesson
 *     responses:
 *       200:
 *         description: Successfully retrieved the lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetLessonByIdParams'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.get('/:id', isEntityValid({ params }), asyncWrapper(lessonController.getLessonByID))

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lesson]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLessonRequest'
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', asyncWrapper(lessonController.createLesson))

/**
 * @swagger
 * /lessons/{id}:
 *   patch:
 *     summary: Update a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLessonParams'
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', isEntityValid({ params }), asyncWrapper(lessonController.updateLesson))

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lesson
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(lessonController.deleteLesson))

module.exports = router
