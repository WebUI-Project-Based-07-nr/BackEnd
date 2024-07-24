const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const locationController = require('~/controllers/location')

router.get('/', asyncWrapper(locationController.getCountries))

module.exports = router
