const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const idValidation = require('~/middlewares/idValidation')
const isEntityValid = require('~/middlewares/entityValidation')
const categoryController = require('~/controllers/category')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const Category = require('~/models/category')

const {
  roles: { ADMIN }
} = require('~/consts/auth')

const params = [{ model: Category, idName: 'id' }]

router.use(authMiddleware)

router.param('id', idValidation)

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories with optional filtering, sorting, and pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter categories by name (supports partial matching with regex)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         required: false
 *         description: The maximum number of categories to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: The number of categories to skip before starting to collect the result set
 *     responses:
 *       200:
 *         description: A list of categories matching the query, each with its associated subjects
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
 *                         description: The category ID
 *                         example: '1234567890abcdef12345678'
 *                       name:
 *                         type: string
 *                         description: The name of the category
 *                         example: 'Technology'
 *                       subjects:
 *                         type: array
 *                         description: The list of subjects associated with the category
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The subject ID
 *                               example: 'abcdef1234567890abcdef12'
 *                             name:
 *                               type: string
 *                               description: The name of the subject
 *                               example: 'AI'
 *                             category:
 *                               type: string
 *                               format: ObjectId
 *                               description: The ObjectId reference to the associated category
 *                               example: '1234567890abcdef12345678'
 *       401:
 *         description: Unauthorized user
 */
router.get('/', asyncWrapper(categoryController.getCategories))

/**
 * @swagger
 * /categories/{id}/subjects/names:
 *   get:
 *     summary: Retrieve the names of subjects associated with a specific category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: A list of subject names associated with the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: The name of a subject
 *                 example: 'AI'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized user
 */
router.get('/:id/subjects/names', isEntityValid({ params }), asyncWrapper(categoryController.getSubjectNamesById))

/** @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, insufficient permissions
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */
router.post('/', restrictTo(ADMIN), asyncWrapper(categoryController.createCategory))

module.exports = router
