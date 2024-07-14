module.exports = {
  UpdateUserParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the user'
      }
    }
  },
  UpdateUserRequest: {
    type: 'object',
    properties: {
    }
  }
}
