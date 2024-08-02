const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const categoryController = require('~/controllers/category')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const {
    roles: { ADMIN }
} = require('~/consts/auth')

router.use(authMiddleware)
router.use(restrictTo(ADMIN))

/**
 * @swagger
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
router.post('/', asyncWrapper(categoryController.createCategory))

module.exports = router
