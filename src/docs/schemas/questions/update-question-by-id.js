module.exports = {
  UpdateQuestionParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the question'
      }
    }
  },
  UpdateQuestionRequest: {
    type: 'object',
    properties: {
      title: { type: 'string' }
    }
  }
}
