const router = require('express').Router({ mergeParams: true })

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')

const messageController = require('~/controllers/message')
const Chat = require('~/models/chat')

const params = [{ model: Chat, idName: 'id' }]

router.use(authMiddleware)

/**
 * @swagger
 * /{id}/messages:
 *   get:
 *     summary: Get messages in a chat
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat
 *     responses:
 *       200:
 *         description: Successfully retrieved messages
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', isEntityValid({ params }), asyncWrapper(messageController.getMessages))

/**
 * @swagger
 * /{id}/messages:
 *   post:
 *     summary: Send a message to a chat
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', asyncWrapper(messageController.sendMessage))

/**
 * @swagger
 * /{id}/messages:
 *   delete:
 *     summary: Delete messages in a chat
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat
 *     responses:
 *       204:
 *         description: Messages deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.delete('/', isEntityValid({ params }), asyncWrapper(messageController.deleteMessages))

/**
 * @swagger
 * /{id}/messages:
 *   patch:
 *     summary: Clear message history in a chat
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat
 *     responses:
 *       200:
 *         description: Message history cleared successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.patch('/', isEntityValid({ params }), asyncWrapper(messageController.clearHistory))

module.exports = router
