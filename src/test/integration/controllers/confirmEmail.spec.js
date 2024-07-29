const confirmEmailService = require('~/services/confirmEmail')
const { serverInit, serverCleanup, stopServer } = require('~/test/setup')

jest.mock('~/services/confirmEmail')

describe('confirmEmail integration test', () => {
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

    test('Should redirect to the client URL on successful email confirmation', async () => {
        confirmEmailService.confirmEmail.mockResolvedValue()

        const response = await app
            .get('/confirm-email')
            .query({ confirmToken: 'testToken' })

        expect(confirmEmailService.confirmEmail).toHaveBeenCalledWith('testToken')
        expect(response.status).toBe(302)
        expect(response.headers.location).toBe(`${process.env.CLIENT_URL}/`)
    })

    test('Should return a 400 status and error message on failure', async () => {
        const errorMessage = 'Confirmation failed'
        confirmEmailService.confirmEmail.mockRejectedValue(new Error(errorMessage))

        const response = await app
            .get('/confirm-email')
            .query({ confirmToken: 'testToken' })

        expect(confirmEmailService.confirmEmail).toHaveBeenCalledWith('testToken')
        expect(response.status).toBe(400)
        expect(response.body.message).toBe(errorMessage)
    })
})
