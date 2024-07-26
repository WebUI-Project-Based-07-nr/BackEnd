const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const confirmEmailController = require('~/controllers/confirmEmail')

/**
 * @swagger
 * /confirm-email:
 *   get:
 *     summary: Confirm user email
 *     tags: [Email Confirmation]
 *     parameters:
 *       - in: query
 *         name: confirmToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Token to confirm email
 *     responses:
 *       200:
 *         description: Email successfully confirmed
 *       400:
 *         description: Invalid or expired token
 */
router.get('/', asyncWrapper(confirmEmailController.confirmEmail))

module.exports = router
