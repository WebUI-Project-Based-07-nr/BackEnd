const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const errors = require('~/consts/errors')
const locationService = require('~/services/location')

jest.mock('~/services/location')


describe('Location controller', () => {
    let app, server

    beforeAll(async () => {
        ; ({ app, server } = await serverInit())
    })

    afterEach(async () => {
        await serverCleanup()
    })

    afterAll(async () => {
        await stopServer(server)
    })

    test('Should return countries successfully', async () => {
        const mockData = [{ iso2: 'US', name: 'United States' }]
        locationService.fetchCountries.mockResolvedValue(mockData)

        const response = await app
            .get('/countries')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockData)
    });

    test('Should handle 400 error', async () => {
        const error400 = { ...errors.BAD_REQUEST }

        locationService.fetchCountries.mockRejectedValue(error400)

        const response = await app.get('/countries')

        expect(response.status).toBe(400)
        expect(response.body).toEqual(error400)
    })

    test('Should handle 500 error', async () => {
        const error500 = { ...errors.INTERNAL_SERVER_ERROR }

        locationService.fetchCountries.mockRejectedValue(error500)

        const response = await app.get('/countries')

        expect(response.status).toBe(500)
        expect(response.body).toEqual(error500)
    })
});