jest.mock('~/services/token')
jest.mock('~/services/email')
jest.mock('~/services/user')

const authService = require('~/services/auth')
const tokenService = require('~/services/token')
const emailService = require('~/services/email')
const userService = require('~/services/user')

describe('Authentication Service', () => {
  afterEach(async () => {
    jest.clearAllMocks()
  })

  const userData = {
    role: 'student',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'password123',
    language: 'en',
    isEmailConfirmed: true
  }

  test('should signup a new user', async () => {
    userService.createUser.mockResolvedValue({ _id: 'mocked_user_id', email: userData.email })
    tokenService.saveToken.mockResolvedValue(null)
    emailService.sendEmail.mockResolvedValue(null)

    jest.spyOn(tokenService, 'generateConfirmToken').mockReturnValue('mocked_confirm_token')

    const result = await authService.signup(
      userData.role,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.language
    )

    expect(result).toHaveProperty('userId', 'mocked_user_id')
    expect(result).toHaveProperty('userEmail', userData.email)

    expect(tokenService.saveToken).toHaveBeenCalledWith('mocked_user_id', expect.any(String), 'confirmToken')
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      userData.email,
      expect.any(String),
      userData.language,
      expect.any(Object)
    )
  })

  test('should login a user', async () => {
    const user = {
      _id: 'mocked_user_id',
      password: userData.password,
      lastLoginAs: 'student',
      isFirstLogin: true,
      isEmailConfirmed: true
    }
    userService.getUserByEmail.mockResolvedValue(user)
    tokenService.saveToken.mockResolvedValue(null)
    tokenService.generateTokens.mockReturnValue({
      accessToken: 'mocked_access_token',
      refreshToken: 'mocked_refresh_token'
    })
    userService.privateUpdateUser.mockResolvedValue(null)

    const result = await authService.login(userData.email, userData.password, false)

    expect(result).toHaveProperty('accessToken', 'mocked_access_token')
    expect(result).toHaveProperty('refreshToken', 'mocked_refresh_token')

    expect(tokenService.saveToken).toHaveBeenCalledWith('mocked_user_id', 'mocked_refresh_token', 'refreshToken')
    expect(userService.privateUpdateUser).toHaveBeenCalledWith('mocked_user_id', { isFirstLogin: false })
  })

  test('should logout a user', async () => {
    tokenService.removeRefreshToken.mockResolvedValue(null)

    await authService.logout('mocked_refresh_token')

    expect(tokenService.removeRefreshToken).toHaveBeenCalledWith('mocked_refresh_token')
  })

  test('should refresh access token', async () => {
    const user = { _id: 'mocked_user_id', lastLoginAs: 'student', isFirstLogin: false }
    tokenService.validateRefreshToken.mockReturnValue({ id: 'mocked_user_id' })
    tokenService.findToken.mockResolvedValue({ refreshToken: 'mocked_refresh_token' })
    userService.getUserById.mockResolvedValue(user)
    tokenService.generateTokens.mockReturnValue({
      accessToken: 'mocked_access_token',
      refreshToken: 'mocked_refresh_token'
    })
    tokenService.saveToken.mockResolvedValue(null)

    const result = await authService.refreshAccessToken('mocked_refresh_token')

    expect(result).toHaveProperty('accessToken', 'mocked_access_token')
    expect(result).toHaveProperty('refreshToken', 'mocked_refresh_token')

    expect(tokenService.saveToken).toHaveBeenCalledWith('mocked_user_id', 'mocked_refresh_token', 'refreshToken')
  })

  test('should send reset password email', async () => {
    const user = { _id: 'mocked_user_id', firstName: userData.firstName, email: userData.email }
    userService.getUserByEmail.mockResolvedValue(user)
    tokenService.generateResetToken.mockReturnValue('mocked_reset_token')
    tokenService.saveToken.mockResolvedValue(null)
    emailService.sendEmail.mockResolvedValue(null)

    await authService.sendResetPasswordEmail(userData.email, userData.language)

    expect(tokenService.saveToken).toHaveBeenCalledWith('mocked_user_id', 'mocked_reset_token', 'resetToken')
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      userData.email,
      expect.any(String),
      userData.language,
      expect.any(Object)
    )
  })

  test('should update password', async () => {
    const tokenData = { id: 'mocked_user_id', firstName: userData.firstName, email: userData.email }
    tokenService.validateResetToken.mockReturnValue(tokenData)
    tokenService.findToken.mockResolvedValue({ resetToken: 'mocked_reset_token' })
    userService.privateUpdateUser.mockResolvedValue(null)
    tokenService.removeResetToken.mockResolvedValue(null)
    emailService.sendEmail.mockResolvedValue(null)

    await authService.updatePassword('mocked_reset_token', 'new_password', userData.language)

    expect(userService.privateUpdateUser).toHaveBeenCalledWith('mocked_user_id', { password: 'new_password' })
    expect(tokenService.removeResetToken).toHaveBeenCalledWith('mocked_user_id')
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      userData.email,
      expect.any(String),
      userData.language,
      expect.any(Object)
    )
  })
})
