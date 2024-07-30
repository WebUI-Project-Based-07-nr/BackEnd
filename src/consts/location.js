const endpoints = {
    BASE_URL: 'https://api.countrystatecity.in/v1/countries',
    CITIES_ENDPOINT: (countryCode) => `https://api.countrystatecity.in/v1/countries/${countryCode}/cities`
}

module.exports = { endpoints }
