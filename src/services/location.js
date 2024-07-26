const { thirdPartyAPIs: { COUNTRY_CITY_STATE_API_KEY } } = require('~/configs/config')
const { endpoints: { BASE_URL } } = require('~/consts/location')
const { createError } = require('~/utils/errorsHelper')
const { errors } = require('~/consts/errors')

const fetchCountries = async () => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            headers: {
                'X-CSCAPI-KEY': COUNTRY_CITY_STATE_API_KEY
            }
        })

        if (response.status === 404) {
            throw createError(404, errors.NOT_FOUND)
        }

        if (!response.ok) {
            throw createError(400, errors.BAD_REQUEST)
        }

        return await response.json()
    } catch (error) {
        if (error.code && error.message) throw error

        throw createError(500, error.INTERNAL_SERVER_ERROR)
    }
}

module.exports = { fetchCountries }
