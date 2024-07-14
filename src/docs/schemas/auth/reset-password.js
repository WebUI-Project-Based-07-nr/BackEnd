module.exports = {
  ResetPassword: {
    type: 'object',
    required: ['password'],
    properties: {
      password: {
        type: 'string'
      }
    }
  }
}
