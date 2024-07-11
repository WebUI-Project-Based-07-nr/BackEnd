module.exports = {
  ForgotPassword: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string'
      }
    }
  }
}
