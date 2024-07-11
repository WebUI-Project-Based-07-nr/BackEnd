const router = require('express').Router()

const Question = require('~/models/question')

const questionController = require('~/controllers/question')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const isEntityValid = require('~/middlewares/entityValidation')
const idValidation = require('~/middlewares/idValidation')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const {
  roles: { TUTOR }
} = require('~/consts/auth')

router.use(authMiddleware)
router.param('id', idValidation)
const params = [{ model: Question, idName: 'id' }]

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Question]
 *     responses:
 *       200:
 *         description: Successfully retrieved questions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '~/docs/schemas/questions/get-questions'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(questionController.getQuestions))

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: Successfully retrieved the question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '~/docs/schemas/questions/get-question-by-id'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get('/:questionId', isEntityValid({ params }), asyncWrapper(questionController.getQuestionById))
router.use(restrictTo(TUTOR))

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/questions/create-question'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', asyncWrapper(questionController.createQuestion))

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question
 *     responses:
 *       204:
 *         description: Question deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(questionController.deleteQuestion))

/**
 * @swagger
 * /questions/{id}:
 *   patch:
 *     summary: Update a question by ID
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/questions/update-question-by-id'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', isEntityValid({ params }), asyncWrapper(questionController.updateQuestion))

module.exports = router
