const locationService = require('~/services/location')
const handleError = require('~/utils/location/location')

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
