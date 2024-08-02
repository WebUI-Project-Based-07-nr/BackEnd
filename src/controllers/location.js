const locationService = require('~/services/location')
const { handleError } = require('~/utils/location/location')
const { createError } = require('~/utils/errorsHelper');
const errors = require('~/consts/errors')

const getCountries = async (_req, res) => {
    try {
        const countries = await locationService.fetchCountries()
        res.json(countries)
    } catch (error) {
        handleError(res, error)
    }
}

const getCities = async (req, res) => {
    const countryCode = req.query.countryCode

    if (!countryCode) {
        const error = createError(400, errors.BAD_REQUEST)
        return handleError(res, error)
    }

    try {
        const cities = await locationService.fetchCities(countryCode)
        res.json(cities)
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = {
    getCountries,
    getCities
}
