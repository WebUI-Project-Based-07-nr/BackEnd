module.exports = {
  UpdateUserStatusParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the user'
      }
    }
  }
}
