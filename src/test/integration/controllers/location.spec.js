const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper');
const locationService = require('~/services/location')

jest.mock('~/services/location')


describe('Location controller', () => {
    let app, server

    beforeAll(async () => {
        ; ({ app, server } = await serverInit())
    })

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterEach(async () => {
        await serverCleanup()
    })

    afterAll(async () => {
        await stopServer(server)
    })

    describe('Fetching countries', () => {
        test('Should return countries successfully', async () => {
            const mockData = [{ iso2: 'US', name: 'United States' }]
            locationService.fetchCountries.mockResolvedValue(mockData)

            const response = await app
                .get('/location/countries')

            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockData)
        })

        test('Should handle error when fetching countries', async () => {
            const mockError = { ...errors.INTERNAL_SERVER_ERROR }
            locationService.fetchCountries.mockRejectedValue(mockError)

            const response = await app
                .get('/location/countries')

            expect(response.status).toBe(500)
            expect(response.body).toEqual(mockError)
        })

        test('Should handle 404 when fetching countries', async () => {
            const mockError = createError(404, errors.NOT_FOUND)
            locationService.fetchCountries.mockRejectedValue(mockError)

            const response = await app
                .get('/location/countries')

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                code: errors.NOT_FOUND.code,
                message: errors.NOT_FOUND.message
            })
        })
    })

    describe('Fetching cities', () => {
        test('Should return cities successfully', async () => {
            const mockData = [{ id: 1, name: 'Kyiv' }]
            locationService.fetchCities.mockResolvedValue(mockData)

            const response = await app
                .get('/location/cities')
                .query({ countryCode: 'UA' })

            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockData)
        })

        test('Should handle 400 if countryCode is missing', async () => {
            const response = await app
                .get('/location/cities')

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                code: errors.BAD_REQUEST.code,
                message: errors.BAD_REQUEST.message
            })
        })

        test('Should handle 404 when fetching cities', async () => {
            const mockError = createError(404, errors.NOT_FOUND)
            locationService.fetchCities.mockRejectedValue(mockError)

            const response = await app
                .get('/location/cities')
                .query({ countryCode: 'UA' })

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                code: errors.NOT_FOUND.code,
                message: errors.NOT_FOUND.message
            })
        })


        test('Should handle error when fetching cities', async () => {
            const mockError = { ...errors.INTERNAL_SERVER_ERROR }
            locationService.fetchCities.mockRejectedValue(mockError)

            const response = await app
                .get('/location/cities')
                .query({ countryCode: 'UA' })

            expect(response.status).toBe(500)
            expect(response.body).toEqual(mockError)
        })
    })
})
