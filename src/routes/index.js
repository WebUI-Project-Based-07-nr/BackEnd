const router = require('express').Router()

const auth = require('~/routes/auth')
const user = require('~/routes/user')
const email = require('~/routes/email')
const adminInvitation = require('~/routes/adminInvitation')
const question = require('~/routes/question')
const resourcesCategory = require('~/routes/resourcesCategory')
const offer = require('~/routes/offer')
const confirmEmail = require('~/routes/confirmEmail')
const location = require('~/routes/location')
const category = require('~/routes/category')
const subject = require('~/routes/subjects')
const lesson = require('~/routes/lesson')

router.use('/auth', auth)
router.use('/users', user)
router.use('/send-email', email)
router.use('/admin-invitations', adminInvitation)
router.use('/questions', question)
router.use('/resources-categories', resourcesCategory)
router.use('/offers', offer)
router.use('/confirm-email', confirmEmail)
router.use('/location', location)
router.use('/categories', category)
router.use('/subjects', subject)
router.use('/lessons', lesson)

module.exports = router
