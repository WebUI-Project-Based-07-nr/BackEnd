const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const locationController = require('~/controllers/location')

/**
 * @swagger
 * /location/countries:
 *   get:
 *     summary: Get list of countries
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: List of countries retrieved successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/countries', asyncWrapper(locationController.getCountries))

/**
 * @swagger
 * /location/cities:
 *   get:
 *     summary: Get list of cities by country code
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: countryCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The country code to get cities for
 *     responses:
 *       200:
 *         description: List of cities retrieved successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/cities', asyncWrapper(locationController.getCities))

module.exports = router
