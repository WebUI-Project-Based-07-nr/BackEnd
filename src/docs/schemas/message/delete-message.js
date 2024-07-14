module.exports = {
  DeleteMessagesParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the chat'
      }
    }
  }
}
