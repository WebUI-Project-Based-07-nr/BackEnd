const locationService = require('~/services/location');
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper');

global.fetch = jest.fn()
jest.mock('~/utils/errorsHelper')

const expectRejected = async (error) => {
    expect(locationService.fetchCountries())
        .rejects
        .toEqual(error)
}

describe('Location service', () => {
    test('Should fetch countries', async () => {
        const mockData = [{ iso2: 'US', name: 'United States' }]
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockData,
        })

        const countries = await locationService.fetchCountries()
        expect(countries).toEqual(mockData)
    })

    test('Should fetch cities', async () => {
        const mockData = [{ id: 1 , name: 'Kyiv' }]
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockData
        })

        const cities = await locationService.fetchCities()
        expect(cities).toEqual(mockData)
    })

    test('Should handle 400 error', async () => {
        const error400 = createError(400, errors.BAD_REQUEST)
        createError.mockReturnValue(error400)

        fetch.mockResolvedValue({
            ok: false,
            status: 400,
        })

        await expectRejected(error400)
    })

    test('Should handle 404 error', async () => {
        const error404 = createError(404, errors.NOT_FOUND)
        createError.mockReturnValue(error404)

        fetch.mockResolvedValue({
            ok: false,
            status: 404
        })

        await expectRejected(error404)
    })

    test('Should handle 500 error', async () => {
        const error500 = createError(500, errors.INTERNAL_SERVER_ERROR)
        createError.mockReturnValue(error500)

        fetch.mockResolvedValue({
            ok: false,
            status: 500,
        })

        await expectRejected(error500)
    })

    test('Should re-throw error with code and message', async () => {
        const mockError = { code: 'ERROR', message: 'Some error' }
        fetch.mockRejectedValue(mockError)

        await expectRejected(mockError)
    })
})
