const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const idValidation = require('~/middlewares/idValidation')

const subjectController = require('~/controllers/subject')
const Subject = require('~/models/subject')


router.use(authMiddleware)

const params = [{ model: Subject, idName: 'id' }]

router.param('id', idValidation)

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Retrieve a list of subjects with optional filtering and pagination
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter subjects by category ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         required: false
 *         description: The maximum number of subjects to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: The number of subjects to skip before starting to collect the result set
 *     responses:
 *       200:
 *         description: A list of subjects matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The subject ID
 *                         example: 'abcdef1234567890abcdef12'
 *                       name:
 *                         type: string
 *                         description: The name of the subject
 *                         example: 'AI'
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The category ID
 *                             example: '1234567890abcdef12345678'
 *                           name:
 *                             type: string
 *                             description: The name of the category
 *                             example: 'Technology'
 *       401:
 *         description: Unauthorized user
 *       403:
 *         description: Forbidden, insufficient permissions
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(subjectController.getSubjects))
router.post('/', asyncWrapper(subjectController.createSubject))

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subject
 *     responses:
 *       204:
 *         description: Subject deleted successfully
 *       400:
 *         description: ID is invalid
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(subjectController.deleteSubject))

module.exports = router
