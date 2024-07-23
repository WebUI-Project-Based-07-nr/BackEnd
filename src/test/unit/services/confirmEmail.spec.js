const dbHandler = require('~/test/dbHandler')
const confirmEmailService = require('~/services/confirmEmail')
const tokenService = require('~/services/token')
const User = require('~/models/user')
const { createError } = require("~/utils/errorsHelper")
const { BAD_CONFIRM_TOKEN } = require('~/consts/errors')

jest.mock('~/services/token')

describe('Confirm Email service', () => {
    beforeAll(async () => {
        await dbHandler.connect()
    })

    afterEach(async () => {
        await dbHandler.clearDatabase()
    })

    afterAll(async () => {
        await dbHandler.closeDatabase()
    })

    const mockConfirmTokenHandling = (user, confirmToken) => {
        tokenService.generateConfirmToken.mockReturnValue(confirmToken)

        tokenService.validateConfirmToken.mockReturnValue({
            id: user._id,
            email: user.email,
        })
    }

    const userData = {
        role: ['student'],
        firstName: 'test',
        lastName: 'test',
        email: 'test.test@example.com',
        password: 'password123',
        appLanguage: 'en',
        isEmailConfirmed: false,
        nativeLanguage: 'English',
    };

    test('should confirm user email successfully', async () => {
        const user = new User(userData)
        await user.save()

        const confirmToken = 'mocked_token'
        mockConfirmTokenHandling(user, confirmToken)

        const confirmedUser = await confirmEmailService.confirmEmail(confirmToken)

        expect(confirmedUser.isEmailConfirmed).toBeTruthy()
    })

    test('should throw 400 BAD_CONFIRM_TOKEN error for invalid token', async () => {
        const invalidConfirmToken = 'invalidConfirmToken'
        tokenService.validateConfirmToken.mockReturnValue(null)

        try {
            await confirmEmailService.confirmEmail(invalidConfirmToken)
        } catch (error) {
            expect(error).toEqual(createError(400, BAD_CONFIRM_TOKEN))
        }
    })

    test('should throw 400 BAD_CONFIRM_TOKEN error for confirmed user', async () => {
        const user = new User(userData)
        user.isEmailConfirmed = true
        await user.save()

        const confirmToken = 'mocked_token'
        mockConfirmTokenHandling(user, confirmToken)

        try {
            await confirmEmailService.confirmEmail(confirmToken)
        } catch (error) {
            expect(error).toEqual(createError(400, BAD_CONFIRM_TOKEN))
        }
    })

    test('should throw 400 BAD_CONFIRM_TOKEN error for non-existing user', async () => {
        const user = new User(userData)

        const confirmToken = 'mocked_token'
        tokenService.generateConfirmToken.mockReturnValue(confirmToken)

        tokenService.validateConfirmToken.mockReturnValue({
            id: user._id,
            email: user.email,
        })

        try {
            await confirmEmailService.confirmEmail(confirmToken)
        } catch (error) {
            expect(error).toEqual(createError(400, BAD_CONFIRM_TOKEN))
        }
    })
})
