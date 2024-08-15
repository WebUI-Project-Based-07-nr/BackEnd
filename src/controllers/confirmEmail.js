const confirmEmailService = require('~/services/confirmEmail')

const confirmEmail = async (req, res) => {
  const { confirmToken } = req.query

  try {
    await confirmEmailService.confirmEmail(confirmToken)
    res.status(200).json({ message: 'Email confirmed successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message, code: error.code })
  }
}

module.exports = {
  confirmEmail
}
