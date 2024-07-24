const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const locationController = require('~/controllers/location')

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get list of countries
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: List of countries retrieved successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/', asyncWrapper(locationController.getCountries))

module.exports = router
