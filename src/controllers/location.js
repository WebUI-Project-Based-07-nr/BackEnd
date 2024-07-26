const locationService = require('~/services/location')
const errors = require('~/consts/errors')

const getCountries = async (req, res) => {
    try {
        const countries = await locationService.fetchCountries()
        res.json(countries)
    } catch (error) {
        let statusCode = 500

        if (error.code === errors.NOT_FOUND.code) {
            statusCode = 404
        } else if (error.code === errors.BAD_REQUEST.code) {
            statusCode = 400
        } else if (error.code === errors.INTERNAL_SERVER_ERROR.code) {
            statusCode = 500
        }

        res.status(statusCode).json({
            code: error.code,
            message: error.message
        })
    }
}

module.exports = { getCountries }
