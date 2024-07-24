const locationService = require('~/services/location');
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper');

global.fetch = jest.fn()
jest.mock('~/utils/errorsHelper')

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

    test('Should handle 400 error', async () => {
        const error400 = createError(400, errors.BAD_REQUEST)
        createError.mockReturnValue(error400)

        fetch.mockResolvedValue({
            ok: false,
            status: 400,
        })

        await expect(locationService.fetchCountries()).rejects.toEqual(error400)
    })

    test('Should handle 500 error', async () => {
        const error500 = createError(500, errors.INTERNAL_SERVER_ERROR)
        createError.mockReturnValue(error500)

        fetch.mockResolvedValue({
            ok: false,
            status: 500,
        })

        await expect(locationService.fetchCountries()).rejects.toEqual(error500)
    })
})