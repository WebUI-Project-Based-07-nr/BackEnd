const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const confirmEmailController = require('~/controllers/confirmEmail')

router.get('/confirm-email', asyncWrapper(confirmEmailController.confirmEmail))

module.exports = router