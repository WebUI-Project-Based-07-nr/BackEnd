const authService = require('~/services/auth')
const { oneDayInMs } = require('~/consts/auth')
const {
  config: { COOKIE_DOMAIN }
} = require('~/configs/config')
const {
  tokenNames: { REFRESH_TOKEN, ACCESS_TOKEN }
} = require('~/consts/auth')
const { createError } = require('~/utils/errorsHelper')
const { BAD_ID_TOKEN, ID_TOKEN_NOT_RETRIEVED } = require('~/consts/errors')

const COOKIE_OPTIONS = {
  maxAge: oneDayInMs,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain: COOKIE_DOMAIN
}

const signup = async (req, res) => {
  const { role, firstName, lastName, email, password, nativeLanguage } = req.body
  const lang = req.lang

  const userData = await authService.signup(role, firstName, lastName, email, password, lang, nativeLanguage)

  res.status(201).json(userData)
}

const login = async (req, res) => {
  const { email, password } = req.body

  const tokens = await authService.login(email, password)

  res.cookie(ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS)
  res.cookie(REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS)

  delete tokens.refreshToken

  res.status(200).json(tokens)
}

const googleLogin = async (req, res) => {
  const idToken = req.body.token?.credential
  if (!idToken) throw createError(400, ID_TOKEN_NOT_RETRIEVED)

  try {
    const payload = await authService.getPayloadFromGoogleTicket(idToken)
    const tokens = await authService.login(payload.email, null, true)

    res.cookie('ACCESS_TOKEN', tokens.accessToken, COOKIE_OPTIONS)
    res.cookie('REFRESH_TOKEN', tokens.refreshToken, COOKIE_OPTIONS)

    delete tokens.refreshToken

    res.status(200).json(tokens)
  } catch (err) {
    throw createError(401, BAD_ID_TOKEN)
  }
}

const logout = async (req, res) => {
  const { refreshToken } = req.cookies

  await authService.logout(refreshToken)

  res.clearCookie(REFRESH_TOKEN)
  res.clearCookie(ACCESS_TOKEN)

  res.status(204).end()
}

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    res.clearCookie(ACCESS_TOKEN)

    return res.status(401).end()
  }

  const tokens = await authService.refreshAccessToken(refreshToken)

  res.cookie(ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS)
  res.cookie(REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS)

  delete tokens.refreshToken

  res.status(200).json(tokens)
}

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body
  const lang = req.lang

  await authService.sendResetPasswordEmail(email, lang)

  res.status(204).end()
}

const updatePassword = async (req, res) => {
  const { password } = req.body
  const resetToken = req.params.token
  const lang = req.lang

  await authService.updatePassword(resetToken, password, lang)

  res.status(204).end()
}

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken,
  sendResetPasswordEmail,
  updatePassword,
  googleLogin
}
