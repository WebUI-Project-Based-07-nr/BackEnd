const User = require('~/models/user')
const bcrypt = require('bcrypt')

const testUserAuthentication = async (app, testUser = {}) => {
  const qtyOfMandatorySignupFields = 5
  if (Object.keys(testUser).length < qtyOfMandatorySignupFields) {
    testUser = {
      role: testUser.role ? testUser.role : 'student',
      firstName: 'Tart',
      lastName: 'Drilling',
      email: 'tartdrilling@gmail.com',
      password: 'Qwerty123@',
      FAQ: { student: [{ question: 'question1', answer: 'answer1' }] },
      nativeLanguage: 'Ukrainian',
      isEmailConfirmed: true,
      lastLoginAs: testUser.role ? testUser.role : 'student'
    }
  }

  testUser.password = await bcrypt.hash(testUser.password, 10)

  await User.create({ ...testUser })

  const loginUserResponse = await app.post('/auth/login').send({ email: testUser.email, password: 'Qwerty123@' })

  return loginUserResponse.body.accessToken
}

module.exports = testUserAuthentication
