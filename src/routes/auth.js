const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const validationMiddleware = require('~/middlewares/validation')
const langMiddleware = require('~/middlewares/appLanguage')

const authController = require('~/controllers/auth')
const signupValidationSchema = require('~/validation/schemas/signup')
const { loginValidationSchema } = require('~/validation/schemas/login')
const resetPasswordValidationSchema = require('~/validation/schemas/resetPassword')
const forgotPasswordValidationSchema = require('~/validation/schemas/forgotPassword')


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/auth/signup'
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Incorrect data
 */
router.post(
  '/signup',
  validationMiddleware(signupValidationSchema),
  langMiddleware,
  asyncWrapper(authController.signup)
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/auth/login'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Incorrect password or username
 */
router.post('/login', validationMiddleware(loginValidationSchema), asyncWrapper(authController.login))

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Successful logout
 */
router.post('/logout', asyncWrapper(authController.logout))

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Update access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token updated
 *       401:
 *         description: Incorrect token
 */
router.get('/refresh', asyncWrapper(authController.refreshAccessToken))

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request to restore password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/auth/forgot-password'
 *     responses:
 *       200:
 *         description: Password recovery email sent.
 *       400:
 *         description: Incorrect data.
 */
router.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.sendResetPasswordEmail)
)

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Password reset.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/auth/reset-password'
 *     responses:
 *       200:
 *         description: Password successfully reset.
 *       400:
 *         description: Incorrect data.
 *       401:
 *         description: Incorrect token.
 */
router.patch(
  '/reset-password/:token',
  validationMiddleware(resetPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.updatePassword)
)

module.exports = router
