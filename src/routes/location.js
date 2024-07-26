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

module.exports = router
