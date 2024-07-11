const router = require('express').Router({ mergeParams: true })

const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')

const offerController = require('~/controllers/offer')
const Offer = require('~/models/offer')

const body = [
  { model: Offer, idName: 'categoryId' },
  { model: Offer, idName: 'subjectId' }
]
const params = [{ model: Offer, idName: 'id' }]

router.use(authMiddleware)

router.param('id', idValidation)

/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get all offers
 *     tags: [Offer]
 *     responses:
 *       200:
 *         description: Successfully retrieved offers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '~/docs/schemas/offers/get-offers'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(offerController.getOffers))

/**
 * @swagger
 * /offers:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/offers/create-offer'
 *     responses:
 *       201:
 *         description: Offer created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/', isEntityValid({ body }), asyncWrapper(offerController.createOffer))

/**
 * @swagger
 * /offers/{id}:
 *   get:
 *     summary: Get an offer by ID
 *     tags: [Offer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the offer
 *     responses:
 *       200:
 *         description: Successfully retrieved the offer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '~/docs/schemas/offers/get-offer-by-id'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
router.get('/:id', isEntityValid({ params }), asyncWrapper(offerController.getOfferById))

/**
 * @swagger
 * /offers/{id}:
 *   patch:
 *     summary: Update an offer by ID
 *     tags: [Offer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '~/docs/schemas/offers/update-offer'
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', isEntityValid({ params }), asyncWrapper(offerController.updateOffer))

/**
 * @swagger
 * /offers/{id}:
 *   delete:
 *     summary: Delete an offer by ID
 *     tags: [Offer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the offer
 *     responses:
 *       204:
 *         description: Offer deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isEntityValid({ params }), asyncWrapper(offerController.deleteOffer))

module.exports = router
