const locationService = require('~/services/location')

const getCountries = async (req, res) => {
    try {
        const countries = await locationService.fetchCountries()
        res.json(countries)
    } catch (error) {
        res.status(error.code === 'INTERNAL_SERVER_ERROR' ? 500 : 400).json({
            code: error.code,
            message: error.message,
        })
    }
}

module.exports = { getCountries }
