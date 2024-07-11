module.exports = {
  SendMessageRequest: {
    type: 'object',
    required: ['message'],
    properties: {
      message: {
        type: 'string',
        description: 'Content of the message'
      }
    }
  }
}
