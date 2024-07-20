const authService = require('~/services/auth')
const tokenService = require('~/services/token')
const emailService = require('~/services/email')
const userService = require('~/services/user')
const dbHandler = require('~/test/dbHandler')

const emailSubject = require('~/consts/emailSubject')
const { tokenNames } = require('~/consts/auth')
jest.mock('~/services/email')

const createUser = async (userData) => {
  return await userService.createUser(
    userData.role,
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.appLanguage,
    userData.isEmailConfirmed
  )
}

const createUserAndLogin = async (userData) => {
  const user = await createUser(userData)

  const tokens = await authService.login(userData.email, userData.password, false)
  return { tokens, user }
}

describe('Authentication Service', () => {
  beforeAll(async () => {
    await dbHandler.connect()
  })

  afterAll(async () => {
    await dbHandler.closeDatabase()
  })

  afterEach(async () => {
    await dbHandler.clearDatabase()
    jest.clearAllMocks()
  })

  const userData = {
    role: 'student',
    firstName: 'Test',
    lastName: 'User',
    email: 'testus1er@example.com',
    password: 'password123',
    language: 'en',
    isEmailConfirmed: true
  }

  test('should signup a new user', async () => {
    const result = await authService.signup(
      userData.role,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.language
    )

    const user = await userService.getUserByEmail(userData.email)
    expect(user).not.toBeNull()
    expect(user.email).toBe(result.userEmail)

    const tokens = await tokenService.findTokensWithUsersByParams({ user: user._id })
    expect(tokens).toHaveLength(1)
    expect(tokens[0].confirmToken).toBeDefined()
  })

  test('should login a user', async () => {
    const user = await createUser(userData)

    const result = await authService.login(userData.email, userData.password, false)

    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')

    const tokens = await tokenService.findTokensWithUsersByParams({ user: user._id })
    expect(tokens).toHaveLength(1)
    expect(tokens[0].refreshToken).toBe(result.refreshToken)

    const updatedUser = await userService.getUserById(user._id)
    expect(updatedUser.isFirstLogin).toBe(false)
  })

  test('should logout a user', async () => {
    const { tokens: {refreshToken} } = await createUserAndLogin(userData)
    await authService.logout(refreshToken)

    const tokens = await tokenService.findTokensWithUsersByParams({ refreshToken })
    expect(tokens).toHaveLength(0)
  })

  test('should refresh access token', async () => {
    const { user, tokens } = await createUserAndLogin(userData)

    const result = await authService.refreshAccessToken(tokens.refreshToken)

    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')

    const savedToken = await tokenService.findTokensWithUsersByParams({ refreshToken: result.refreshToken })

    expect(savedToken).toHaveLength(1)
    expect(savedToken[0].user._id.toString()).toBe(user._id.toString())
  })

  test('should send reset password email', async () => {
    emailService.sendEmail.mockResolvedValue()
    const createdUser = await createUser(userData)

    await authService.sendResetPasswordEmail(userData.email, userData.language)

    const user = await userService.getUserByEmail(userData.email)

    expect(user).not.toBeNull()
    expect(user._id.toString()).toBe(createdUser._id.toString())

    const savedToken = await tokenService.findTokensWithUsersByParams({ user: user._id })

    expect(savedToken).not.toBeNull()
    expect(savedToken[0]).toHaveProperty('resetToken')

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      userData.email,
      expect.any(String),
      userData.language,
      expect.objectContaining({
        resetToken: savedToken[0].resetToken,
        email: userData.email,
        firstName: userData.firstName
      })
    )
  })

  test('should update password', async () => {
    emailService.sendEmail.mockResolvedValue()
    const newPassword = 'new_password'
    const createdUser = await createUser(userData)

    const resetToken = tokenService.generateResetToken({
      id: createdUser._id,
      firstName: userData.firstName,
      email: userData.email
    })
    
    await tokenService.saveToken(createdUser._id, resetToken, tokenNames.RESET_TOKEN)
    await authService.updatePassword(resetToken, newPassword, userData.language)

    const updatedUser = await userService.getUserByEmail(userData.email)
    expect(updatedUser).not.toBeNull()
    expect(updatedUser.password).toBe(newPassword)

    const removedToken = await tokenService.findTokensWithUsersByParams({ user: updatedUser._id })
    expect(removedToken[0].resetToken).toBeNull()

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      userData.email,
      emailSubject.SUCCESSFUL_PASSWORD_RESET,
      userData.language,
      expect.objectContaining({
        firstName: userData.firstName
      })
    )
  })
})
