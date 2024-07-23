const confirmEmailService = require('~/services/confirmEmail')

const confirmEmail = async (req, res) => {
    const { confirmToken } = req.query

    try {
        await confirmEmailService.confirmEmail(confirmToken)
        res.status(200).redirect(`${process.env.CLIENT_URL}/`)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    confirmEmail
}
