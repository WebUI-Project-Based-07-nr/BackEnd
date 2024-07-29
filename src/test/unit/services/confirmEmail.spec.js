const dbHandler = require('~/test/dbHandler')
const confirmEmailService = require('~/services/confirmEmail')
const tokenService = require('~/services/token')
const User = require('~/models/user')
const { createError } = require("~/utils/errorsHelper")
const { BAD_CONFIRM_TOKEN } = require('~/consts/errors')

jest.mock('~/services/token')

const mockConfirmTokenHandling = (user, confirmToken) => {
    tokenService.generateConfirmToken.mockReturnValue(confirmToken)

    tokenService.validateConfirmToken.mockReturnValue({
        id: user._id,
        email: user.email,
    })
}

const expectRejected = async (confirmToken, error) => {
    await expect(confirmEmailService.confirmEmail(confirmToken))
        .rejects
        .toThrow(error.message)
}

describe('Confirm Email service', () => {
    let userData
    const error = createError(400, BAD_CONFIRM_TOKEN)

    beforeAll(async () => {
        await dbHandler.connect()
    })

    beforeEach(() => {
        userData = {
            role: ['student'],
            firstName: 'test',
            lastName: 'test',
            email: 'test.test@example.com',
            password: 'password123',
            appLanguage: 'en',
            isEmailConfirmed: false,
            nativeLanguage: 'English',
        }
        jest.clearAllMocks()
    })

    afterEach(async () => {
        await dbHandler.clearDatabase()
    })

    afterAll(async () => {
        await dbHandler.closeDatabase()
    })

    test('should confirm user email successfully', async () => {
        const user = new User(userData)
        await user.save()

        const confirmToken = 'mocked_token'
        mockConfirmTokenHandling(user, confirmToken)

        await confirmEmailService.confirmEmail(confirmToken)

        const confirmedUser = await User.findById(user._id).select('+isEmailConfirmed')
        expect(confirmedUser.isEmailConfirmed).toBeTruthy()
    })

    test('should throw 400 BAD_CONFIRM_TOKEN error for invalid token', async () => {
        const invalidConfirmToken = 'invalidConfirmToken'
        tokenService.validateConfirmToken.mockReturnValue(null)

        await expectRejected(invalidConfirmToken, error)
    })

    test('should throw 400 BAD_CONFIRM_TOKEN error for confirmed user', async () => {
        userData.isEmailConfirmed = true
        const user = new User(userData)
        await user.save()

        const confirmToken = 'mocked_token'
        mockConfirmTokenHandling(user, confirmToken)

        await expectRejected(confirmToken, error)
    })

    test('should throw 400 BAD_CONFIRM_TOKEN error for non-existing user', async () => {
        const user = new User(userData)
        const error = createError(400, BAD_CONFIRM_TOKEN)

        const confirmToken = 'mocked_token'
        tokenService.generateConfirmToken.mockReturnValue(confirmToken)

        tokenService.validateConfirmToken.mockReturnValue({
            id: user._id,
            email: user.email,
        })

        await expectRejected(confirmToken, error)
    })
})
