const router = require('express').Router()

const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { restrictTo, authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const upload = require('~/middlewares/multer')

const userController = require('~/controllers/user')
const User = require('~/models/user')
const {
  roles: { ADMIN }
} = require('~/consts/auth')

const params = [{ model: User, idName: 'id' }]

router.use(authMiddleware)

router.param('id', idValidation)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUsersResponse'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(userController.getUsers))

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the user
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', isEntityValid({ params }), asyncWrapper(userController.getUserById))

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserParams'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', isEntityValid({ params }), asyncWrapper(userController.updateUser))

router.use(restrictTo(ADMIN))

/**
 * @swagger
 * /users/{id}/change-status:
 *   patch:
 *     summary: Change user status by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User status changed successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/change-status', isEntityValid({ params }), asyncWrapper(userController.updateStatus))

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(userController.deleteUser))

/**
 * @swagger
 * /users/image:
 *   post:
 *     summary: Upload a user image
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *     responses:
 *       204:
 *         description: The image was uploaded successfully.
 *       400:
 *         description: Bad request, possibly due to invalid file type or size
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/image', authMiddleware, upload.single('file'), asyncWrapper(userController.uploadImage))

module.exports = router
