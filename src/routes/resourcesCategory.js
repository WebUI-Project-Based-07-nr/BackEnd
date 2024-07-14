const router = require('express').Router()

const ResourceCategory = require('~/models/resourcesCategory')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const idValidation = require('~/middlewares/idValidation')
const resourcesCategoryController = require('~/controllers/resourcesCategory')

const {
  roles: { TUTOR }
} = require('~/consts/auth')

const params = [{ model: ResourceCategory, idName: 'id' }]
router.param('id', idValidation)

router.use(authMiddleware)
router.use(restrictTo(TUTOR))

/**
 * @swagger
 * /resources-categories:
 *   get:
 *     summary: Get all resource categories
 *     tags: [Resources Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved resource categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetResourcesCategoriesResponse'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(resourcesCategoryController.getResourcesCategories))

/**
 * @swagger
 * /resources-categories/names:
 *   get:
 *     summary: Get names of all resource categories
 *     tags: [Resources Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved resource category names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/names', asyncWrapper(resourcesCategoryController.getResourcesCategoriesNames))

/**
 * @swagger
 * /resources-categories:
 *   post:
 *     summary: Create a new resource category
 *     tags: [Resources Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourcesCategoryRequest'
 *     responses:
 *       201:
 *         description: Resource category created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', asyncWrapper(resourcesCategoryController.createResourcesCategory))

/**
 * @swagger
 * /resources-categories/{id}:
 *   patch:
 *     summary: Update a resource category by ID
 *     tags: [Resources Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the resource category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateResourceCategoryParams'
 *     responses:
 *       200:
 *         description: Resource category updated successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Resource category not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', isEntityValid({ params }), asyncWrapper(resourcesCategoryController.updateResourceCategory))

/**
 * @swagger
 * /resources-categories/{id}:
 *   delete:
 *     summary: Delete a resource category by ID
 *     tags: [Resources Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the resource category
 *     responses:
 *       204:
 *         description: Resource category deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Resource category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(resourcesCategoryController.deleteResourceCategory))

module.exports = router
