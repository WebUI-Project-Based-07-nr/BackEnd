
const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const idValidation = require('~/middlewares/idValidation')
const isEntityValid = require('~/middlewares/entityValidation')

const quizController = require('~/controllers/quiz')
const Quiz = require('~/models/quiz')

const params = [{ model: Quiz, idName: 'id' }]

router.use(authMiddleware)

router.param('id', idValidation)

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Successfully retrieved quizzes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetQuizzesResponse'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(quizController.getQuizzes))

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quiz
 *     responses:
 *       200:
 *         description: Successfully retrieved the quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetQuizByIdResponse'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:id', isEntityValid({ params }), asyncWrapper(quizController.getQuizById))

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuizRequest'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', asyncWrapper(quizController.createQuiz))

/**
 * @swagger
 * /quizzes/{id}:
 *   patch:
 *     summary: Update a quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuizRequest'
 *     responses:
 *       204:
 *         description: Quiz updated successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', isEntityValid({ params }), asyncWrapper(quizController.updateQuiz))

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quiz
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(quizController.deleteQuiz))

module.exports = router
