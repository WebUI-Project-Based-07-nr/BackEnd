const locationService = require('~/services/location')

const getCountries = async (req, res) => {
    try {
        const countries = await locationService.fetchCountries()
        res.json(countries)
    } catch (error) {
        let statusCode = 500

        if (error.code === 'NOT_FOUND') {
            statusCode = 404
        } else if (error.code === 'BAD_REQUEST') {
            statusCode = 400
        }

        res.status(statusCode).json({
            code: error.code,
            message: error.message,
        })
    }
}

module.exports = { getCountries }
