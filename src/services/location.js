const { thirdPartyAPIs: { COUNTRY_CITY_STATE_API_KEY } } = require('~/configs/config')
const {
    endpoints: { BASE_URL, CITIES_ENDPOINT }
} = require('~/consts/location')
const { fetchData } = require('~/utils/location/location')

const locationService = {
    fetchCountries: () => {
        const url = BASE_URL
        const options = {
            headers: {
                'X-CSCAPI-KEY': COUNTRY_CITY_STATE_API_KEY
            }
        }

        return fetchData(url, options)
    },

    fetchCities: (countryCode) => {
        const url = CITIES_ENDPOINT(countryCode)
        const options = {
            method: 'GET',
            headers: {
                'X-CSCAPI-KEY': COUNTRY_CITY_STATE_API_KEY
            },
            redirect: 'follow'
        }

        return fetchData(url, options)
    }
}

module.exports = locationService
