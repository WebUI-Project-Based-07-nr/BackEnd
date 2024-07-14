const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const langMiddleware = require('~/middlewares/appLanguage')

const emailController = require('~/controllers/email')

/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Send email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendEmail'
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post('/', langMiddleware, asyncWrapper(emailController.sendEmail))

module.exports = router
