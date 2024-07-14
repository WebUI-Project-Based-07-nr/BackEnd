const router = require('express').Router()

const langMiddleware = require('~/middlewares/appLanguage')
const asyncWrapper = require('~/middlewares/asyncWrapper')

const adminInvitationController = require('~/controllers/adminInvitation')


/**
 * @swagger
 * /admin-invitations:
 *   post:
 *     summary: Send admin invitations
 *     tags: [Admin Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Invitations sent successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', langMiddleware, asyncWrapper(adminInvitationController.sendAdminInvitations))

/**
 * @swagger
 * /admin-invitations:
 *   get:
 *     summary: Get admin invitations
 *     tags: [Admin Invitations]
 *     responses:
 *       200:
 *         description: Successfully retrieved admin invitations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(adminInvitationController.getAdminInvitations))

module.exports = router
