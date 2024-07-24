const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const confirmEmailController = require('~/controllers/confirmEmail')

/**
 * @swagger
 * /auth/confirm-email:
 *   get:
 *     summary: Confirm user email
 *     tags: [Auth]
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
router.get('/auth/confirm-email', asyncWrapper(confirmEmailController.confirmEmail))

module.exports = router