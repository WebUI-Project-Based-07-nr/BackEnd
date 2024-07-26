const User = require('~/models/user')
const tokenService = require('~/services/token')
const { createError } = require('~/utils/errorsHelper')
const { BAD_CONFIRM_TOKEN } = require('~/consts/errors')

const confirmEmail = async confirmToken => {
    const decoded = tokenService.validateConfirmToken(confirmToken)
    if (!decoded) {
        throw createError(400, BAD_CONFIRM_TOKEN)
    }

    const user = await User.findById(decoded.id)
    if (!user || user.isEmailConfirmed) {
        throw createError(400, BAD_CONFIRM_TOKEN)
    }

    user.isEmailConfirmed = true
    await user.save()
}

module.exports = {
    confirmEmail
}
